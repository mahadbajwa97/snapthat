# snapthat
Task

I have made a blogging web app with node js and its components

Node JS express framework has been used to construct the app.

Following are the key features:
-> Indexing of blogs on the landing page
-> Create a blog form with choice of adding N sections, on will of user
-> Commenting on the blog by providing basic personal information
-> Image upload via multer
-> Blog display
-> mongoDB database storage

Please follow the following links to access the web app:

"/" for accessing create a blog form
"/index" for accessing list of blogs
"/blog/:id" for accessing respective blog display

Building process:
The task was not too complicated. It took me little time to integrate primitive features, such as blog posting, commentting and database configuration. The difficulty was to integrate multiple sections option. It was easy on the part of interface but required few complex logics at the backend. The error such as "Cannot assign value to undefined" took me a day to debug. Finally, I was able to integrate multiple sections options with help of object declaration and loops. Then, the difficulty occured in terms of uploading pictures. I used multer to integrate the upload pictures feature. Though, the alternatives requiired a more sophisticated study of Grid fs and binary data conversion, for which I did not opt due to time constraints. Multer used local storage to upload images. The limitation was that each form can process only a single picture thus, a blog can have just one image. The fb sharing option is integrated with the blog and it does redirect to facebook. The problem is that I have not hosted my app on heroku to give it a dynamic link to execute sharing. Thus, it has functional code but, it does not share explicitly.  
