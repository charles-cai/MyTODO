namespace Microsoft.Samples.MyTodo.Web.Controllers
{
    using System;
    using System.Globalization;
    using System.Security.Principal;
    using System.Web.Mvc;
    using System.Web.Security;

    using Microsoft.Samples.MyTodo.Web.Models;

    // The FormsAuthentication type is sealed and contains static members, so it is difficult to
    // unit test code that calls its members. The interface and helper class below demonstrate
    // how to create an abstract wrapper around such a type in order to make the AccountController
    // code unit testable.
    public interface IFormsAuthentication
    {
        void SignIn(string userName, bool createPersistentCookie);

        void SignOut();
    }

    public interface IMembershipService
    {
        int MinPasswordLength { get; }

        bool ValidateUser(string userName, string password);

        MembershipCreateStatus CreateUser(string userName, string password, string email);

        bool ChangePassword(string userName, string oldPassword, string newPassword);

        MembershipUser GetUserProfile(string userName);
    }

    [HandleError]
    public class AccountController : Controller
    {
        // This constructor is used by the MVC framework to instantiate the controller using
        // the default forms authentication and membership providers.
        public AccountController()
            : this(null, null)
        {
        }

        // This constructor is not used by the MVC framework but is instead provided for ease
        // of unit testing this type. See the comments at the end of this file for more
        // information.
        public AccountController(IFormsAuthentication formsAuth, IMembershipService membershipService)
        {
            this.FormsAuth = formsAuth ?? new FormsAuthenticationService();
            this.MembershipService = membershipService ?? new AccountMembershipService();
        }

        public IFormsAuthentication FormsAuth { get; private set; }

        public IMembershipService MembershipService { get; private set; }

        public ActionResult LogOn()
        {
            return View();
        }
        
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1054:UriParametersShouldNotBeStrings",
            Justification = "Needs to take same parameter type as Controller.Redirect()")]
        [ValidateAntiForgeryToken]
        public ActionResult LogOn(string userName, string password, bool rememberMe, string returnUrl)
        {
            if (!this.ValidateLogOn(userName, password))
            {
                return View();
            }

            this.FormsAuth.SignIn(userName, rememberMe);
            if (!string.IsNullOrEmpty(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return this.RedirectToAction("Index", "Home");
        }

        public ActionResult LogOff()
        {
            this.FormsAuth.SignOut();

            return RedirectToAction("Index", "Home");
        }

        public ActionResult Register()
        {
            this.ViewData["PasswordLength"] = this.MembershipService.MinPasswordLength;

            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        [ValidateAntiForgeryToken]
        public ActionResult Register(RegisterModel model)
        {
            this.ViewData["PasswordLength"] = this.MembershipService.MinPasswordLength;

            if (this.ValidateRegistration(model.UserName, model.Email, model.Password, model.ConfirmPassword, string.Empty, string.Empty, string.Empty))
            {
                // Attempt to register the user
                var createStatus = this.MembershipService.CreateUser(model.UserName, model.Password, model.Email);

                if (createStatus == MembershipCreateStatus.Success)
                {
                    this.FormsAuth.SignIn(model.UserName, false /* createPersistentCookie */);
                    return RedirectToAction("Index", "Home");
                }

                this.ModelState.AddModelError("_FORM", ErrorCodeToString(createStatus));
            }

            // If we got this far, something failed, redisplay form
            return View();
        }

        [Authorize]
        public new ActionResult Profile()
        {
            this.ViewData["PasswordLength"] = this.MembershipService.MinPasswordLength;
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post), Authorize]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes",
            Justification = "Exceptions result in password not being changed.")]
        public new ActionResult Profile(ChangePasswordModel model)
        {
            this.ViewData["PasswordLength"] = this.MembershipService.MinPasswordLength;

            if (!this.ValidateChangePassword(model.OldPassword, model.NewPassword, model.ConfirmPassword, string.Empty, string.Empty, string.Empty))
            {
                return View();
            }

            try
            {
                if (!string.IsNullOrEmpty(model.NewPassword))
                {
                    if (!this.MembershipService.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword))
                    {
                        ModelState.AddModelError("_FORM", "The current password is incorrect or the new password is invalid.");
                        return this.View();
                    }
                }

                return this.View("ProfileUpdateSuccess");
            }
            catch
            {
                ModelState.AddModelError("_FORM", "The current password is incorrect or the new password is invalid.");
                return View();
            }
        }

        public ActionResult ProfileUpdateSuccess()
        {
            return View();
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.User.Identity is WindowsIdentity)
            {
                throw new InvalidOperationException("Windows authentication is not supported.");
            }
        }

        #region Validation Methods

        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://msdn.microsoft.com/en-us/library/system.web.security.membershipcreatestatus.aspx for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "Username already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A username for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }

        private bool ValidateChangePassword(string currentPassword, string newPassword, string confirmPassword, string twitterUsername, string twitterPassword, string twitterConfirmPassword)
        {
            if (!string.IsNullOrEmpty(currentPassword))
            {
                if (newPassword == null || newPassword.Length < this.MembershipService.MinPasswordLength)
                {
                    ModelState.AddModelError(
                        "newPassword",
                        string.Format(CultureInfo.CurrentCulture, "You must specify a new password of {0} or more characters.", this.MembershipService.MinPasswordLength));
                }

                if (!string.Equals(newPassword, confirmPassword, StringComparison.Ordinal))
                {
                    ModelState.AddModelError("_FORM", "The new password and confirmation password do not match.");
                }
            }

            return ModelState.IsValid;
        }

        private bool ValidateLogOn(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName))
            {
                ModelState.AddModelError("username", "You must specify a username.");
            }

            if (string.IsNullOrEmpty(password))
            {
                ModelState.AddModelError("password", "You must specify a password.");
            }

            if (!this.MembershipService.ValidateUser(userName, password))
            {
                ModelState.AddModelError("_FORM", "The username or password provided is incorrect.");
            }

            return ModelState.IsValid;
        }

        private bool ValidateRegistration(string userName, string email, string password, string confirmPassword, string twitterUsername, string twitterPassword, string twitterConfirmPassword)
        {
            if (string.IsNullOrEmpty(userName))
            {
                ModelState.AddModelError("username", "You must specify a username.");
            }

            if (string.IsNullOrEmpty(email))
            {
                ModelState.AddModelError("email", "You must specify an email address.");
            }

            if (password == null || password.Length < this.MembershipService.MinPasswordLength)
            {
                ModelState.AddModelError(
                    "password",
                    string.Format(CultureInfo.CurrentCulture, "You must specify a password of {0} or more characters.", this.MembershipService.MinPasswordLength));
            }

            if (!string.Equals(password, confirmPassword, StringComparison.Ordinal))
            {
                ModelState.AddModelError("_FORM", "The new password and confirmation password do not match.");
            }

            return ModelState.IsValid;
        }

        #endregion
    }
}