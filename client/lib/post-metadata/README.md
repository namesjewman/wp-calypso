Post Metadata
=============

Post Metadata is a set of helper functions to assist in extracting metadata from a post object.

## Usage

Each function in the module expects to receive a post object, and will return either the value, or `undefined` if the value could be not be determined from the object.

```js
var PostMetadata = require( 'lib/post-metadata' ),
	geoCoordinate = PostMetadata.geoCoordinate( post );
```
