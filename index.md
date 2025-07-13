---
layout: home
title: Welcome
author_profile: true
---

## Latest Posts

{% for post in site.posts limit:5 %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}

[View all posts](/posts/)
