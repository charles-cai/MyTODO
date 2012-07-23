## myTODO Sample

myTODO is a sample application to manage and share simple lists, for example tasks to complete, favorite movies, books you enjoyed, and so on. With full list management, you can cross off items, give them due dates, add, and remove items through a rich HTML 5, mobile-friendly interface.

The sample was built using [ASP.NET MVC 4](http://www.asp.net/mvc/mvc4), [jQuery](http://jquery.com/) and [Windows Azure SQL Databases](https://www.windowsazure.com/en-us/home/features/data-management/) for the underlying data store. It also exposes public lists through HTTP services using [ASP.NET Web API](http://www.asp.net/web-api).  This sample demonstrates the following:

- How to use Windows Azure SQL Databases with a Windows Azure Web Site
- How to deploy a Windows Azure Web Site with Web Deploy
- How to build and run mobile web sites on Windows Azure

### Prerequisites ###
* [Visual Studio 2012](http://www.microsoft.com/visualstudio/11/en-us)
* [ASP.NET MVC 4](http://www.asp.net/mvc/mvc4)
* A Windows Azure account that has been enabled for Windows Azure Web Sites. You can sign up for a [free account](http://bit.ly/mytodosfreetrial "Sign up for Windows Azure for Free Here") on the WindowsAzure.com web site and have access to deploy 10 web sites for free for 1 year. 

### Running the Sample Locally ###

1. Open Visual Studio 2012.
2. Compile the solution. The NuGet packages dependencies will be automatically downloaded and installed.
3. Set the **MyTodo.Web** as startup project and press F5.

### Deploying and Running the Sample in Windows Azure Web Sites ###

1. Browse to the Windows Azure portal at [https://manage.windowsazure.com](https://manage.windowsazure.com).

1. Click on the New button in the left corner and select **Web Site** -> **Create with Database**.

    ![new-web-site-portal](images/new-web-site-portal.png?raw=true)

1. Enter a URL for the MyToDo application, select "Create a new SQL database" from the Database drop-down list, and select the closest data center in the Region drop-down list. Press the arrow in the dialog to proceed to the next step.

    ![new-web-site-dialog1](images/new-web-site-dialog1.png?raw=true)

1. For the Database Settings, enter a database name and select "New SQL Database server" from the Server drop-down list.

    ![new-web-site-dialog2](images/new-web-site-dialog2.png?raw=true)

1. For the **Create a Server** step, enter an admin name and password.  Leave the option **Allow Windows Azure Services to access the server** checked.  Finally, press the complete button (checkbox icon) to create the new web site, Windows Azure SQL Server, and Windows Azure SQL Database.

    ![new-web-site-dialog3](images/new-web-site-dialog3.png?raw=true)

1. Click the **Web Sites** navigation link within the Windows Azure portal to see a list of your web sites. Then, click the web site you just created to open up the site's **Dashboard** in the portal.

	![List of Web Sites in the Windows Azure Portal](images/list-of-web-sites-in-the-windows-azure-portal.png?raw=true)

1. The site's dashboard will open. 

	_**Note:** if this is the first time you've logged into  the Windows Azure portal and used the Web Sites feature, you may see a welcome page rather than the site's dashboard. If this is the case, simply click the **Dashboard** link [highlighted below] in the navigation bar at the top of the window._ 

	![Site Dashboard](images/site-dashboard.png?raw=true)

1. In the **Quick Glance** navigation bar on the right side of the Dashboard, click the link labelled **Download Publish Profile**. 

	This will download an XML file containing the Web Deploy deployment details. This file will not only enable publication of your web site, but also contains the connection information specific to the database you created with the site. This file, when used with Web Deploy from within Visual Studio 2012, is all you need to deploy your web site _and_ database to Windows Azure. 

	![Publish profile settings download link](images/publish-profile-settings-download-link.png?raw=true)

1. Save the publish profile settings file to your local computer in a convenient location, as you'll be using it in the next step from within Visual Studio 2012. 

	![Download the publish settings file](images/download-the-publish-settings-file.png?raw=true)

1. Open the **MyToDo** solution in Visual Studio 2012.

1. Now you're ready to deploy the MyToDo web site to Windows Azure using **Web Deploy** from within Visual Studio 2012.  Right click on the MyToDo.Web project in solution explorer and select **Publish** from the context menu. 

	![Publishing from within Visual Studio 2012](images/publishing-from-within-visual-studio-2012.png?raw=true)

1. In the **Publish Web** dialog, click the **Import** button. Navigate to the publish settings file you just downloaded, and select the file. If the dialog doesn't advance to the next step automatically once you select the file, click the **Next** button. 

	![Import the publish settings](images/import-the-publish-settings.png?raw=true)

1. Click the **Validate Connection** button to verify the connection works and that the Web Deploy information is correct. Then, click the **Next** button to advance to the next step in the deployment process.

	![Validating the publish settings](images/validating-and-publishing.png?raw=true)

1. Select the connection string from the drop-down menu and verify that both the **Use this connection string at runtime** and **Apply Code First Migrations** checkboxes are both checked. Then, click the **Publish** button to publish the site and to run the Entity Framework migrations on the Windows Azure SQL Database to create the database structure. 

	![Setting the database connection string](images/setting-the-database-connection-string.png?raw=true)

1. You should see the MyToDo home page with some sample task lists and tasks. From here you can login to create or edit your own tasks. 

	![The myTODO application following deployment](images/the-mytodo-application-following-deployment.png?raw=true)

1. Since the MyToDo app has been developed with ASP.NET MVC4 and jQuery mobile, you can also browse the site on your phone. Below you can see the myTODO app being browsed using the [Electric Plum iPhone Simulator](http://electricplum.com/simulator.aspx "Electric Plum iPhone Simulator").

	![myTODO on an iPhone](images/mytodo-on-an-iphone.png?raw=true "myTODO on an iPhone")

	The picture below illustrates how the site will be rendered in the [Windows Phone 7 Emulator](http://bit.ly/wp7emul8r "Windows Phone 7 Emulator"). 

	![Windows Phone 7 Emulator](images/windows-phone-7-emulator.png?raw=true "Windows Phone 7 Emulator")
	