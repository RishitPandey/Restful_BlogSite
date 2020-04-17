const mongoose = require("mongoose");
const blog = require("./models/blogmodel");
const comment = require("./models/comment");
let data = [
  {
    name: "HouseBound",
    image: "https://i.ytimg.com/vi/Kyy6DzlIPUw/maxresdefault.jpg",
    des:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum nostrum dicta exercitationem deserunt perferendis a, vel debitis asperiores quo quos est voluptate repellendus iure alias repellat corrupti dignissimos distinctio ad.",
    author: "User",
  },
  {
    name: "Peaky Blinders",
    image:
      "https://assets.entrepreneur.com/content/3x2/2000/20190918135414-tommy-shelby-peaky-blinders.jpeg",
    des:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum nostrum dicta exercitationem deserunt perferendis a, vel debitis asperiores quo quos est voluptate repellendus iure alias repellat corrupti dignissimos distinctio ad.",
    author: "User",
  },
  {
    name: "Narcos",
    image:
      "https://media-assets-05.thedrum.com/cache/images/thedrum-prod/s3-news-tmp-116055-narcos---default--1280.jpg",
    des:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum nostrum dicta exercitationem deserunt perferendis a, vel debitis asperiores quo quos est voluptate repellendus iure alias repellat corrupti dignissimos distinctio ad.",
    author: "User",
  },
];

function seedDB() {
  blog.remove({}, function (err) {
    if (err) console.log(err);
    console.log("removed blogs!");
    data.forEach(function (seed) {
      blog.create(seed, function (err, blogs) {
        if (err) console.log(err);
        else {
          console.log("addded a blog");
          //create comments
          comment.create(
            {
              text: "This blog is just amazing",
              author: "Kalle",
            },
            function (err, comment) {
              if (err) console.log(err);
              console.log(comment);
              blogs.comments.push(comment);
              blogs.save();
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
