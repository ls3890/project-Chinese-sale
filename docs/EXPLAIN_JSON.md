# הסברים על קבצי JSON ותצורה

קבצי JSON בפרויקט (כמו `package.json` ו-`proxy.conf.json`) לא תומכים בהוספת הערות בתוך הקובץ עצמו. לכן שמרתי כאן הסברים קצרים כדי שתוכל להבין בקלות מה כל קובץ עושה:

## proxy.conf.json
- המטרה: להעביר קריאות `/api` ל-backend מקומי בכתובת `https://localhost:7231` בזמן פיתוח.
- כך ה-dev-server של Angular מונע בעיות CORS ומאפשר לך לעבוד נגד backend מקומי.

## package.json
- `scripts.start` מפעיל את `ng serve --proxy-config proxy.conf.json`.
- הקבצים `dependencies` ו-`devDependencies` מגדירות את כל חבילות ה-Node/Angular הנדרשות.

> אם תרצה שאכניס הערות מפורטות אחרות או קבצי דוקומנטציה נוספים (למשל מדריך פיתוח מקומי עם דוגמאות), אמור לי ואוסיף אותם לכאן.