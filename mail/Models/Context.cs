using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OpenPop.Mime;
using OpenPop.Pop3;

namespace Nifo.Platform.Mail.Models
{
    public class Context
    {
        private static Context instance = new Context();
 
        // Private constructor prevents instantiation from other classes
        private Context() { }

        public static Context getInstance()
        {
                return instance;
        }


        public List<NifoMail> Messages = new List<NifoMail>();
        public string Username { get; set; }
        public string Password {get;set;}
        public string Hostname {get{return "pop.gmail.com";}}
        public int Port {get{return 995;}}
        public bool UseSsl { get { return true; } }
        public string SMTPhost { get { return "smtp.gmail.com"; } }
        public int SMTPort { get { return 587; } }
    }

    public class NifoMail {
        public Message Mail { get; set; }
        public bool IsRead { get; set; }
    }
}