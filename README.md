# Content Calendar

Viewed your scheduled content posts in a visual calendar. Prioritize and get organized on the fly.

TODO: SCREENSHOT

## Features

- Prioritize content reviews
- Better content review
- More time for quality content

# Installation

`sanity install content-calendar`

## How to configure

To use the calendar, you must first tell it which document types and fields to use when looking for scheduled documents.

Open up the config file found in ./config/content-calendar.json and add your document type and field combinations.

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

### Example scheduler job, a script publishing the documents

The following is an example of a script that queries for scheduled events that should occur, and publishes those document revisions. You would probably want to run this script periodically, for instance every minute as a cronjob.

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
