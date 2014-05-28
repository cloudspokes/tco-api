/* ---------------------
routes.js

For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.

- actions defined in params directly 'action=theAction' or hitting the named URL for an action '/api/theAction' will always override RESTful routing
- you can mix explicitly defined params with route-defined params.  If there is an overlap, the route-defined params win
  - IE: /api/user/123?userId=456 => 'connection.userId = 123'
  - this is a change from previous versions
- routes defined with the 'all' method will be duplicated to 'get', 'put', 'post', and 'delete'
- use ':variable' to defined 'variable'
- undefined ':variable' will match
  - IE: '/api/user/' WILL match '/api/user/:userId'
- routes are matched as defined here top-down
- you can optionally define a regex match along with your route variable
  - IE: { path:'/game/:id(^[a-z]{0,10}$)', action: 'gamehandler' }
  - be sure to double-escape when needed: { path: '/login/:userID(^\\d{3}$)', action: 'login' }

example:

{
  get: [
    { path: '/users', action: 'usersList' }, // (GET) /api/users
    { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
  ],

  post: [
    { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
  ],

  all: [
    { path: '/user/:userID', action: 'user' } // (*) / /api/user/123
  ]
}

---------------------- */

////////////
// ROUTES //
////////////

exports.routes = {

  get: [
    { path: '/my-profile/settings/:id', action: 'settings' },
    { path: '/tcos/:tco_id/events/:id/attendees', action: 'eventAttendees' },
    { path: '/tcos/:tco_id/events/:id/like', action: 'eventLiked' },
    { path: '/tcos/:tco_id/events/:id', action: 'event' },
    { path: '/tcos/:tco_id/events', action: 'eventsList' },
    { path: '/tcos/:tco_id/messages/:id', action: 'message' },
    { path: '/tcos/:tco_id/messages', action: 'messagesList' },
    { path: '/tcos/:tco_id/attendees/:id/like', action: 'attendeeLiked' },
    { path: '/tcos/:tco_id/attendees/:id', action: 'attendee' },
    { path: '/tcos/:tco_id/attendees', action: 'attendeesList' },
    {
      path: '/tcos/:tco_id/albums/:album_id/multimedia/:id',
      action: 'multimedia'
    },
    {
      path: '/tcos/:tco_id/albums/:album_id/multimedia',
      action: 'multimediaList'
    },
    { path: '/tcos/:tco_id/albums/:id/like', action: 'albumLiked' },
    { path: '/tcos/:tco_id/albums/:id', action: 'album' },
    { path: '/tcos/:tco_id/albums', action: 'albumsList' },
    { path: '/tcos/:tco_id/news/:id', action: 'news' },
    { path: '/tcos/:tco_id/news', action: 'newsList' },
    { path: '/tcos/:tco_id/sponsors/:id', action: 'sponsor' },
    { path: '/tcos/:tco_id/sponsors', action: 'sponsorsList' },
    { path: '/tcos/:tco_id/:attendee_id/unread-messages-count', action: 'attendeeUnreadMessages' },
    { path: '/tcos/:tco_id/favorite-albums', action: 'favoriteAlbums' },
    { path: '/tcos/:tco_id/favorite-attendees', action: 'favoriteAttendees' },
    { path: '/tcos/:tco_id/favorite-events', action: 'favoriteEvents' },
    { path: '/tcos/:id', action: 'tco' },
    { path: '/tcos', action: 'tcosList' }
  ],

  delete: [
    { path: '/tcos/:tco_id/messages/:id', action: 'deleteMessage' }
  ],

  post: [
    { path: '/tcos/:tco_id/attendees/:id/like', action: 'likeAttendee' }
  ]

};
