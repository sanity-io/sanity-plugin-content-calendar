# Content Calendar

Schedule content for later publication and view your content agenda in a visual calendar. Prioritize and get organized on the fly.

TODO: SCREENSHOT

## Features

- Prioritize content reviews
- Better content review
- More time for quality content

## Installation

`sanity install content-calendar`

## Configuration

To use the calendar, you must first tell it which document types and fields to use when looking for scheduled documents.

Create or open (the file is automatically created the first time the studio starts after adding the plugin) the config file found in `config/content-calendar.json` in your Studio folder and add your document type and field combinations.

```json
{
  "types": [
    {
      "type": "post",
      "field": "publishedAt",
      "titleField": "title"
    }
  ],
  "calendar": {
    "event": {
      "dateFormat": "MMMM, dd yyyy",
      "timeFormat": "hh:mm a",
      "showAuthor": "false"
    }
  }
}
```

## Caveats

### Performing the publish event, in the future

This plugin does not perform the publishing of documents on its own, as it is just a Studio plugin running in your editors browser. So in order to actually perform the scheduled publishing a script needs to run either periodically, or at the given publishing times to perform the publish action. We advise setting up a cronjob running for instance every minute that checks if any document should be published and then perform that action. A full script that does this is represented below.

When the publish event eventually occurs, any newer draft will be discarded. This is why the plugin warns you if you make further changes to a document after you schedule it. If you do not want to lose these newer changes you'll need to Reschedule them, as the plugin prompts lets you do via the main action on a document in this state, and the Calendar view also will warn you about documents that have changes on top of scheduled content.

### Publishing the scheduled documents

This script polls for pending scheduled publishing events and performs them. Typically you'll run this as a serverless function that is invoked every minute from a cronjob or other scheduled action, or you could schedule this script to run at specific times by using webhooks and listening for new schedule.metadata documents.

```javascript
const sanityClient = require("@sanity/client");
const client = sanityClient({
  projectId: "your-project-id",
  dataset: "your-dataset-name",
  // Need a write token in order to read schedule metadata and publish documents
  token: "your-write-token",
  useCdn: false,
});

// Query for any scheduled publish events that should occur
const query = `* [_type == "schedule.metadata" && !(_id in path("drafts.**")) && datetime <= now()]`;

const publish = async (metadata, client) => {
  const dataset = client.config().dataset;
  const id = metadata.documentId;
  const rev = metadata.rev;

  // Fetch the draft revision we should publish from the History API
  const uri = `/data/history/${dataset}/documents/drafts.${id}?revision=${rev}`;
  const revision = await client
    .request({ uri })
    .then((response) => response.documents.length && response.documents[0]);

  if (!revision) {
    // Here we have a situation where the scheduled revision does not exist
    // This can happen if the document was deleted via Studio or API without
    // unscheduling it first.
    console.error("Could not find document revision to publish", metadata);
    return;
  }

  // Publish it
  return (
    client
      .transaction()
      // Publishing a document is simply writing it to the dataset without a
      // `drafts.` prefix. The `documentId` field on the metadata already does
      // not include this prefix, but the revision we fetched probably does, so
      // we overwrite it here.
      .createOrReplace(Object.assign({}, revision, { _id: id }))
      // Then we delete any current draft.
      .delete(`drafts.${id}`)
      // And finally we delete the schedule medadata, since we're done with it.
      .delete(metadata._id)
      .commit()
  );
};

client
  .fetch(query)
  .then((response) =>
    Promise.all(response.map((metadata) => publish(metadata, client)))
  );
```

### Scenario: You already have custom document actions implemented

This plugin adds the Schedule, Unschedule and Reschedule actions to your configured documents by implementing the part `part:@sanity/base/document-actions/resolver`. Because of a current limitation (as of version 2.0.9), these will not compose with your own implementation of this part for resolving document actions. If this is you, you need to add in the custom scheduling actions like in the following example

```javascript
// import the default document actions
import defaultResolve from 'part:@sanity/base/document-actions'
import { adjustActionsForScheduledPublishing } from 'sanity-plugin-content-calendar/src/documentActions'

const CustomAction = () => ({
  label: 'Hello world',
  onHandle: () => {
    window.alert('👋 Hello from custom action')
  }
})

export default function resolveDocumentActions(props) {
  const actions = [...defaultResolve(props), CustomAction]
  return adjustActionsForScheduledPublishing(props, actions)
}
```

### Scenario: You already have custom document badges implemented

As with the case of already implemented custom document actions, if you have implemented custom document badges with `part:@sanity/base/document-badges/resolver` you'll currently need to add in the Scheduled badge from this plugin as in the following example

```javascript
import defaultResolve from 'part:@sanity/base/document-badges'
import { addScheduledBadge } from 'sanity-plugin-content-calendar/src/documentBadges'

const CustomBadge = () => {
  return {
    label: 'Custom',
    title: 'Hello I am a custom document badge',
    color: 'success'
  }
}

export default function resolveDocumentBadges(props) {
  const badges = [...defaultResolve(props), CustomBadge]
  return addScheduledBadge(badges)
}

```
