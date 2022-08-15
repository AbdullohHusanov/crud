create table users (
    user_id int generated by default as identity primary key,
    username character varying(20) not null,
    password character varying(256) not null,
    email character varying(128) not null,
    created_at TIMESTAMP NOT NULL,
  	updated_at TIMESTAMP NOT NULL
);

create table posts (
    post_id int generated by default as identity primary key,
    user_id int not null references users (user_id),
    title character varying(64) not null,
    description character varying(128) not null,
  	created_at TIMESTAMP NOT NULL,
  	updated_at TIMESTAMP NOT NULL
);

create table comments (
    comment_id int generated by default as identity primary key,
    user_id int not null references users (user_id),
    post_id int not null references posts (post_id),
    comment_text character varying(64) not null,
    created_at TIMESTAMP NOT NULL,
  	updated_at TIMESTAMP NOT NULL
);

insert into users(username, password, email) values('nodir', crypt('sadfadf', gen_salt('bf')), 'sadfsad@mada.ru'),('qodir', 'sdfsdf', 'saa@jis.nb'),('shokir', 'u546y5', 'odfuo@ooaf.ijf');
insert into posts(title, description, user_id) values('qale', 'nimasd is difafdiads naisduf ai jnid', 1),('tinch', 'odfodsfogd sodgsdu dou du aooasdo us', 2),('yaxshimi', 'ueur3r ire rerri eb eiru', 3);
insert into comments(comment_text, post_id, user_id) values('sisa d i uais', 2, 3),('pob f ifg oin', 1, 1),('what th e f u ck', 3, 2);