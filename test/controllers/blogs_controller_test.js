require('../test_helper.js').controller('blogs', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        title: '',
        content: '',
        createdAt: ''
    };
}

exports['blogs controller'] = {

    'GET new': function (test) {
        test.get('/blogs/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/blogs', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Blog.find;
        Blog.find = sinon.spy(function (id, callback) {
            callback(null, new Blog);
        });
        test.get('/blogs/42/edit', function () {
            test.ok(Blog.find.calledWith('42'));
            Blog.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Blog.find;
        Blog.find = sinon.spy(function (id, callback) {
            callback(null, new Blog);
        });
        test.get('/blogs/42', function (req, res) {
            test.ok(Blog.find.calledWith('42'));
            Blog.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var blog = new ValidAttributes;
        var create = Blog.create;
        Blog.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, blog);
            callback(null, blog);
        });
        test.post('/blogs', {Blog: blog}, function () {
            test.redirect('/blogs');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var blog = new ValidAttributes;
        var create = Blog.create;
        Blog.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, blog);
            callback(new Error, null);
        });
        test.post('/blogs', {Blog: blog}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Blog.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/blogs/1', new ValidAttributes, function () {
            test.redirect('/blogs/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Blog.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/blogs/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

