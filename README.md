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
            "field": "publishedAt"
        },
        {
            "type": "landingPage",
            "field": "publishedAt"
        }
    ]
}
```

### How to query for scheduled documents

```javascript
const query = `
    * [_type == "schedule.metadata"] {
      ...,
      "doc": * [_id == ^.documentId || _id == "drafts." + ^.documentId ]
    }
  `
```

Example resulting response:

```json

```