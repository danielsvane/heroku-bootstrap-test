load 'application'

action 'index', () -> 
    Post.all (err, posts) =>
        @posts = posts
        @title = 'Posts index'
        render()
