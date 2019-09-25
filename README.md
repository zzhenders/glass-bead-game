# Glassbeads

![React](https://img.shields.io/badge/-React-5ed4f4) ![JavaScript](https://img.shields.io/badge/-JavaScript-f8d524) ![Python](https://img.shields.io/badge/-Python-3572a5) ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-red)
![Flask](https://img.shields.io/badge/-Flask-lightgrey) ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-32648c) ![CSS](https://img.shields.io/badge/-CSS-264bde) ![Argon2](https://img.shields.io/badge/-Argon2-blueviolet)

Glassbeads is a social media website which encourages semantically organized high quality conversations by its data organization. Each post exists in relation to others through a citation system. A post has references and other posts reference it, so navigating conversations is a primary way in which a user engages in content on the site. I planned it as an alternative platform for a Discord community of artists and musicians I am a part of.

I built Glassbeads in 4.5 weeks as a capstone project at Hackbright Academy.

![Preview image demonstrating the home page view of Glassbeads](https://github.com/zzhenders/glassbeads/blob/master/preview-image.png)

## My tech stack:

* React
* PostgreSQL
* Python
	* SQLAlchemy
	* Flask
* JavaScript
* CSS
* Argon2 (for hashing user passwords)

## Purpose

I chose the tech stack and features in order to learn and get experience with a variety of technologies and processes that were new or unfamiliar. In particular, I focused heavily on React and JavaScript because asynchronicity and context had been challenges for me. React was entirely new to me and very rewarding to wrestle with.

This project also gave me an opportunity to research and implement a bespoke authentication and session management system. OWASP guidelines were invaluable here. Bespoke security is not a good idea for production unless you know what you're doing! However, security is one of my particular interests and doing things incorrectly is one of the best ways to learn.

## Installation

The React portion of this Glassbeads was developed as a create-react-app in /gb-react. Navigate to gb-react, then the following will install the necessary dependencies and compile the react app.

```
$ yarn install
$ yarn run build
```

Move the relevant contents of `gb-react/build` to `templates` and `static` in the project directory, and Flask will serve the files for you.
