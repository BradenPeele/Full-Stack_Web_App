Overview
-users can make posts that display on the home page
-users can comment on and like posts
-posts can be deleted, edited
-comments can be deleted
-profile for user displays all posts made by them
-user can change their password


important
-node_modules not included in client
-users might have to change password to database in config.json


DB
users(id, username, password) - userId(pk)
posts(id, userId, title, text) - id(pk), userId(fk)
comments(id, userId, postId, text) - id(pk), userId(fk), postId(fk)
likes(id, userId, postId, commentId) - id(pk), userId(fk), postId(fk), commentId(fk)


Backlog
-bugs
    -logout and can change likes/other
        -fix by navigating to login after logout
-implement  
    -sort posts
    -direct message
    -reply to comments
    -dislikes
    -likes/dislikes on comments, replies
    -store token in cookies
    -fix possible security issues - storing userid, username, password in bad places


