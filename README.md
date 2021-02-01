# Sanity Plugin Content Calendar

Schedule and view your editorial calendar, right where you store your content. Prioritize and get organized on the fly with a visual calendar in your Studio.

![Sanity Content Calendar in Studio](https://cdn.sanity.io/images/3do82whm/next/d54091e26bf136069b0cce00b11a02fda2a5ddae-2844x1780.png?h=650)

## Features

- Graphical representation of your editorial calendar
- At-a-glance schedule review
- Quick prioritization of content to review
- More time to create content, less time spent scheduling

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
  - [Installing with other custom document actions](#installing-with-other-custom-document-actions)
  - [Installing with other custom document badges](#installing-with-other-custom-document-badges)
- [Usage](#usage)
  - [Performing the publish event, in the future](#performing-the-publish-event-in-the-future)
  - [Publishing the scheduled documents](#publishing-the-scheduled-documents)

## Installation

Run the following command in your studio folder using [the Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli):

```sh
sanity install content-calendar
```
## Configuration

To use the calendar, the plugin needs to know which document types to display and what fields to use for scheduling documents.

Create or open the config file found in `config/content-calendar.json`. The file is automatically created the first time the studio starts after adding the plugin. Add your document type and field combinations.

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

`titleField` also supports nested properties, like `title.en`.

In the configuration values, you can also modify how the dates and times are formatted on the calendar, as well as being able to show the document author.

> Note: the type.field option signals when this post should be scheduled to release, this requires us to add a "date" or "datetime" field to the document you want to enable
> scheduling for.

### Installing with other custom document actions

The plugin adds the Schedule, Unschedule, and Reschedule actions to your configured documents by implementing the part `part:@sanity/base/document-actions/resolver`.

Because of a current limitation (as of version 2.0.9), these will not compose with your own implementation of this part for resolving document actions. For more on the parts system, [see the part system documentation](https://www.sanity.io/docs/parts).

To implement the plugin, add the custom scheduling actions with your custom action.

```javascript
// import the default document actions
import defaultResolve from 'part:@sanity/base/document-actions'
import { addActions } from 'sanity-plugin-content-calendar/build/register'

const CustomAction = () => ({
  label: 'Hello world',
  onHandle: () => {
    window.alert('👋 Hello from custom action')
  },
})

export default function resolveDocumentActions(props) {
  const actions = [...defaultResolve(props), CustomAction]
  return addActions(props, actions)
}
```

### Installing with other custom document badges

Much like custom document actions, if you have implemented custom document badges with `part:@sanity/base/document-badges/resolver` you need to add in the Scheduled badge from the plugin.

```javascript
import defaultResolve from 'part:@sanity/base/document-badges'
import { addBadge } from 'sanity-plugin-content-calendar/build/register'

const CustomBadge = () => {
  return {
    label: 'Custom',
    title: 'Hello I am a custom document badge',
    color: 'success',
  }
}

export default function resolveDocumentBadges(props) {
  const badges = [...defaultResolve(props), CustomBadge]
  return addBadge(props, badges)
}
```
## Usage
### Performing the publish event, in the future

This plugin does not perform the publishing of documents on its own, as it is just a Studio plugin running in an editors' browser. In order to actually perform the scheduled publishing, a script needs to run either periodically, or at the given publishing times to perform the publish action.

We advise setting up a cronjob running for instance every minute that checks if any document should be published and then perform that action. A full script that does this is represented below.

When the publish event eventually occurs, any newer draft will be discarded. This is why the plugin warns you if you make further changes to a document after you schedule it. If you don't want to lose the newer changes an editor will need to Reschedule them. The plugin will prompt for this with a warning in the calendar view and an updated document action.

### Publishing the scheduled documents

To publish documents, you can set up a serverless function to poll for pending scheduled events and perform the action. Typically, this can be run from a cronjob every minute or from another scheduled action.

Alternatively, you could schedule this script to run at specific times by using webhooks and listening for new `schedule.metadata` documents.

```javascript
const sanityClient = require('@sanity/client')
const client = sanityClient({
  projectId: 'your-project-id',
  dataset: 'your-dataset-name',
  // Need a write token in order to read schedule metadata and publish documents
  token: 'your-write-token',
  useCdn: false,
})

// Query for any scheduled publish events that should occur
const query = `* [_type == "schedule.metadata" && !(_id in path("drafts.**")) && datetime <= now()]`

const publish = async (metadata, client) => {
  const dataset = client.config().dataset
  const id = metadata.documentId
  const rev = metadata.rev

  // Fetch the draft revision we should publish from the History API
  const uri = `/data/history/${dataset}/documents/drafts.${id}?revision=${rev}`
  const revision = await client
    .request({ uri })
    .then((response) => response.documents.length && response.documents[0])

  if (!revision) {
    // Here we have a situation where the scheduled revision does not exist
    // This can happen if the document was deleted via Studio or API without
    // unscheduling it first.
    console.error('Could not find document revision to publish', metadata)
    return
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
  )
}

client
  .fetch(query)
  .then((response) => Promise.all(response.map((metadata) => publish(metadata, client))))
```
