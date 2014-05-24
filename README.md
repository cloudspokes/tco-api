# TopCoder Open API

## Overview

The API uses the ActionHero framework. If you are not familiar with it, please [checkout their wiki](http://actionherojs.com/wiki) especially the sections for actions and initializers. You may also want to check out their [tutorial](https://github.com/evantahler/actionhero-tutorial). There is also sample code in the /actions and /initializers directories above to get you started.

[The API documentation is available at our apiary project](http://docs.tcoapi.apiary.io/) and should be used as the basis for building this API. Please refer to it often. If you find something wrong with the API or need something added or modified, please use github issues. All code submitted for this project must have accompanying tests or it will not be accepted.

The data for the API resides in Salesforce and is sync'd to Postgres using [Heroku Connect](https://www.heroku.com/connect) (HC). When building the API you will only use Postgres but just be aware that data is being sync'd back and forth. You can [find more info on HC here](https://devcenter.heroku.com/articles/herokuconnect).

When HC creates the tables in Postgres is uses the Salesforce style table and field names, except the database uses only lower-case letters. Therefore, the table that holds all of the Event data will be called `tco_event__c` and any custom fields that were added will also contain `__c`, example `start_time__c`. The Saleforce Id field is renamed as `sfid` in the database table.

For more info on connecting to PG from the command line, see [Accessing the synchronized tables](https://devcenter.heroku.com/articles/herokuconnect#accessing-the-synchronized-tables). To connect in terminal use the connection string you were provided

```
psql [CONNECTION-STRING]
set search_path=salesforce,public;
\d
```

For your application, add the connection string to your environment with:

```
export CLOUDCONNECT_CONN=[CONNECTION-STRING]
```

The API should **not** return fields to the client with `__c`. There are two ways to remove these:

1 - Use the [forcifier package](https://github.com/jeffdonthemic/forcifier-node) to remove the `__c` from the JSON before returning the results:

```javascript
var forcifier = require('forcifier');

var client = new pg.Client(api.config.general.pg.connString);
client.connect(function(err) {
  var sql = "select * from salesforce.tco__c";
  client.query(sql, function(err, rs) {
    if (err) next(err);
    if (!err) next(forcifier.deforceJson(rs['rows'])); // remove all __c's        
  })
})
```

2 - Alias the columns in the query. This may be the easiest route:

```javascript
var client = new pg.Client(api.config.general.pg.connString);
client.connect(function(err) {
  var sql = "select event.id, event.type__c as type, tco.unique_id__c as tco_id " +
   "from salesforce.tco_event__c as event " +
   "inner join salesforce.tco__c as tco on event.tco__c = tco.sfid";
  client.query(sql, function(err, rs) {
    if (err) next(err);
    if (!err) next(rs['rows']);         
  })
})
```


## Installation

You should be able to fork this repo, run `npm install` and then `npm start` to start the app on port 8080.

## Development

### No callback hell! 

Always use Promises; [Q](https://github.com/kriskowal/q) is already installed so please use it. [Here is some sample code](https://github.com/jeffdonthemic/nforce-tooling/blob/master/test/deploy.js) using Promises if you'd like to take a look.


### Running tests

For testing, always use [Chai](http://chaijs.com/) and any assertion style that you like but try and stick to `Should` if you can. You must have 

You can run tests with `npm test`.

### SQL Injection

Make sure your code prevents SQL injection attacks. See these examples for [querying](https://github.com/cloudspokes/cs-api-node/blob/master/initializers/communities.js#L46) and [inserting records](https://github.com/cloudspokes/cs-api-node/blob/master/initializers/challenges.js#L184).

### Latest Code

Before you start on a new issue, always do `git pull` to get the latest changes into your local branch.

## Database Schema

Here are the PG tables with some sample data. A sample query to return all events would look like:

```sql
select 
  event.id, 
  event.name, 
  event.sfid,
  event.type__c as type,
  tco.unique_id__c as tco_id 
from salesforce.tco_event__c as event 
inner join salesforce.tco__c as tco on event.tco__c = tco.sfid;
```

### TCO

```bash
city__c          | San Francisco
end_date__c      | 2014-11-19
unique_id__c     | tco14 // THIS IS THE TCO_ID
location__c      | Pier 48
lastmodifieddate | 2014-03-31 18:48:52
createddate      | 2014-03-31 18:14:07
isdeleted        | f
start_date__c    | 2014-11-16
state__c         | CA
name             | TopCoder Open 14
zip__c           | 94158
website__c       | http://community.topcoder.com/tco14
id               | 1
sfid             | a1SU00000016eF7MAI
```

### TCO Attendee

```bash
country__c                  | United States
avatar__c                   | http://community.topcoder.com/i/m/jeffdonthemic.jpeg
first_name__c               | Jeff
allow_private_messages__c   | t
email__c                    | jeff@appirio.com
type__c                     | Appirio
quote__c                    | I like to make things with 1's and 0's.
member_since__c             | 2010-05-21
isdeleted                   |
handle__c                   | jeffdonthemic
display_name__c             | Handle
event_push_notifications__c | t
id                          | 2
sfid                        | a1UU0000001VMyyMAG
name                        | jeffdonthemic
tco__c                      | a1SU00000016eF7MAI
lastmodifieddate            | 2014-05-21 16:15:21
twitter__c                  | jeffdonthemic
createddate                 | 2014-03-31 19:11:00
last_name__c                | Douglas
current_challenges__c       | 1
```

### TCO Event

```bash
lastmodifieddate | 2014-03-31 18:38:08
type__c          | Session
end_time__c      | 2014-03-31 19:00:00
details__c       | Come join us for the opening ceremony with drinks and appetizers.
name             | Welcome Ceremony
tco__c           | a1SU00000016eF7MAI
isdeleted        | f
id               | 1
createddate      | 2014-03-31 18:38:08
start_time__c    | 2014-03-31 18:00:00
sfid             | a1VU0000000VLifMAG
location__c      | Grand Ballroom
```

### TCO Event Notification

```bash
createddate      | 2014-05-21 15:51:39
id               | 1
sfid             | a1cU0000000ncCPIAY
isdeleted        | f
event__c         | a1VU0000000VfQmMAK
attendee__c      | a1UU0000001VJyaMAG
name             | EN-1000
```

### TCO Event Participant

```bash
attendee__c      | a1UU0000001VMyyMAG
createddate      | 2014-05-21 15:51:31
lastmodifieddate | 2014-05-21 15:51:31
name             | EP-1000
event__c         | a1VU0000000VfQmMAK
isdeleted        | f
id               | 1
sfid             | a1dU0000000XX7XIAW
```

### TCO Favorite

```bash
createddate      | 2014-05-21 15:53:54
id               | 2
sfid             | a1bU0000007e7uxIAA
isdeleted        | f
attendee__c      | a1UU0000001VMyyMAG
type__c          | Album
name             | FAV-1002
fav_album__c     | a1ZU00000028MkrMAE
fav_attendee__c  |
lastmodifieddate | 2014-05-21 15:53:54
fav_event__c     |
```

### TCO Album

```bash
id               | 1
createddate      | 2014-05-21 15:53:26
isdeleted        | f
sfid             | a1ZU00000028MhPMAU
name             | Day 1 Album
cover__c         |
lastmodifieddate | 2014-05-21 15:53:26
tco__c           | a1SU00000016eF7MAI
```

### TCO Multimedia

```bash
createddate      | 2014-05-21 15:57:25
lastmodifieddate | 2014-05-21 15:57:25
name             | Image 1
sfid             | a1aU00000040fVZIAY
url__c           | http://i.imgur.com/47yHROy.png
album__c         | a1ZU00000028MhPMAU
isdeleted        | f
id               | 1
```

### TCO News

```bash
createddate      | 2014-03-31 18:38:37
isdeleted        | f
id               | 1
tco__c           | a1SU00000016eF7MAI
source_url__c    | http://www.topcoder.com/blog/welcome
content__c       | <div>This is the news content....</div>
lastmodifieddate | 2014-05-21 16:23:19
name             | TCON-1000
source__c        | Blog
sfid             | a1WU0000000gzbMMAQ
```

### TCO Private Message

```bash
isdeleted        | f
from_attendee__c | a1UU0000001VJyaMAG
createddate      | 2014-04-08 11:30:03
sfid             | a1XU0000000Vig2MAC
content__c       | I am in the main lobby grabbing something to eat.
id               | 1
subject__c       | Meet me at the breakfast bar!
name             | TCOM-1001
attachment__c    |
tco__c           | a1SU00000016eF7MAI
status__c        |
to_attendee__c   | a1UU0000001VMyyMAG
lastmodifieddate | 2014-04-08 11:30:03
```

### TCO Sponsor

```bash
logo__c          | http://www.google.com
createddate      | 2014-05-21 15:54:28
level__c         | Gold
video__c         | https://www.youtube.com/watch?v=-QfhTWJIDCM
id               | 2
sfid             | a1TU0000008FBuFMAW
isdeleted        | f
lastmodifieddate | 2014-05-21 16:25:19
name             | memSQL
tco__c           | a1SU00000016eF7MAI
description__c   | These guys are awesome
```

### TCO Sponsor Applicant

```bash
id               | 1
createddate      | 2014-05-21 15:54:03
isdeleted        | f
sponsor__c       | a1TU0000008DyiIMAS
attendee__c      | a1UU0000001VMyyMAG
lastmodifieddate | 2014-05-21 15:54:03
sfid             | a1YU00000014ICDMA2
name             | SA-1000
```



