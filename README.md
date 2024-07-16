# gitlabExtension
Saucy is a VS code extension that integrates gitlab merge request comments into your code editor.
After installing the extension, go to your extension settings and enter your gitlab access token and project ID.
**Note that you only need read permissions for your access token. This token should be your personal token and not the repo token.**

# To install:
Run
	```
code --install-extension saucy-0.0.1.vsix
	```
It should now look like this\
\
 ![image](https://github.com/user-attachments/assets/75af40da-c2df-4df6-9e39-cf7f496827ee)

# To Run Saucy:
- Go to the run menu (cmd + shift + p on mac) and click on Saucy.
- Now Saucy will start checking for new comments on  whichever branch you are on.
A new comment will trigger a toast message indicating the file where the comment was made.
On a file that has comments, you will see a highlighted line over the lines that were covered in the MR comment. Hovering over
the code on this line will show the actual text of the comments.

**Switching branches will auto check for the new branch.**



# Contributors
- Arron Abay
- Juan Echevarria
- Tariq Shams



