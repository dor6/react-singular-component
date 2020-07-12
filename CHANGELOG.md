8.1.2:  
- added opacity support

---

8.1.1:  
- update packages
- changed the list example to use hooks

---

8.1.0:  
- added native support for 'borderWidth', 'borderRightWidth', 'borderLeftWidth', 'borderTopWidth', 'borderBottomWidth', 'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'.
- fixed a problem that some color attributes that wont work because of browser support will not threw an error and stop the animations of following attributes (only heppened to me in firefox because of missing values in getComputedStyle()).

---

8.0.0:  
- drop support of custom easing function as it seems unneeded.
- easing prop now accepts only the name of the easing function instead of a function (you can see all the existing functions in the readme).
- default easing is now 'easeOutQuad' instead of 'linear'.

---

7.0.1:  
- added changelog to readme.

---

7.0.0:  
- changed default animationDuration to 500.
- added continousAnimation (default true) which means that from now on, unless is false, animations wich interupt ongoing animation will continue from the same state as the ongoing animation (which will be canceled). 

---

6.7.7:  
- up until this moment just take the current features as given and think evertything until now was a blank.

---
6.6.6:  
- this is where we started.