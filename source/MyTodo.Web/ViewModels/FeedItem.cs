namespace Microsoft.Samples.MyTodo.Web.ViewModels
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;

    public class FeedItem
    {
        public FeedItem()
        {
            this.Tags = new Collection<string>();
        }

        public string Creator { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public Uri Url { get; set; }

        public DateTime Published { get; set; }

        public ICollection<string> Tags { get; private set; }
    }
}