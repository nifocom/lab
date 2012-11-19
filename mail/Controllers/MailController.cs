using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using OpenPop;
using OpenPop.Pop3;
using OpenPop.Mime;

using System.Net;
using System.Net.Mail;

using System.Net.Sockets;
using System.Net.Security;
using System.IO;
using Nifo.Platform.Mail.Models;
using System.Net;
using System.Text;

namespace Nifo.Platform.Mail.Controllers
{
    public class MailController : Controller
    {
        //
        // GET: /Mail/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// get emails from server
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetMail(string username, string password)
        {
            Context.getInstance().Password = password;
            Context.getInstance().Username = username;

            #region openpop
            string hostname = Context.getInstance().Hostname;
            int port = Context.getInstance().Port;
            bool useSsl = Context.getInstance().UseSsl;

            using (Pop3Client client = new Pop3Client())
            {
                client.Connect(hostname, port, useSsl);// Connect to the server              
                client.Authenticate("recent:" + username, password);// Authenticate ourselves towards the server

                int messageCount = client.GetMessageCount();// Get the number of messages in the inbox


                List<MsgOverview> allMessages = new List<MsgOverview>();// We want to download all messages

                // Messages are numbered in the interval: [1, messageCount]
                // Ergo: message numbers are 1-based.
                // Most servers give the latest message the highest number
                for (int i = messageCount; i > 0; i--)
                {
                    Message msg = client.GetMessage(i);
                    allMessages.Add(new MsgOverview() {
                        Index = i,
                        MsgId = msg.Headers.MessageId,
                        From = msg.Headers.From.Address,
                        Date = msg.Headers.DateSent.ToShortDateString() + " " + msg.Headers.DateSent.ToShortTimeString(),
                        Subject = msg.Headers.Subject,
                        
                    });

                    Context.getInstance().Messages.Add(new NifoMail(){Mail = msg, IsRead = false}); //save messages to context
                }

                //Now return the fetched messages
                return Json(allMessages, JsonRequestBehavior.AllowGet);
            }
            #endregion
        }

        /// <summary>
        /// get email details from context
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetMailDetails(string msgID)
        {
            NifoMail msg = Context.getInstance().Messages.Where(m=>m.Mail.Headers.MessageId == msgID).First();
            return Json(msg.Mail,JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public bool DeleteMail(string msgID)
        {
            using (Pop3Client client = new Pop3Client())
            {
                client.Connect(Context.getInstance().Hostname, Context.getInstance().Port, Context.getInstance().UseSsl);// Connect to the server              
                client.Authenticate("recent:" + Context.getInstance().Username, Context.getInstance().Password);// Authenticate ourselves towards the server

                // Get the number of messages on the POP3 server
                int messageCount = client.GetMessageCount();

                // Run trough each of these messages and download the headers
                for (int messageItem = messageCount; messageItem > 0; messageItem--)
                {
                    // If the Message ID of the current message is the same as the parameter given, delete that message
                    if (client.GetMessageHeaders(messageItem).MessageId == msgID)
                    {
                        // Delete
                        client.DeleteMessage(messageItem);

                        //delete from context
                        var msgToDelete = Context.getInstance().Messages.Where(m => m.Mail.Headers.MessageId == msgID).First();
                        Context.getInstance().Messages.Remove(msgToDelete);

                        return true;
                    }
                }

                // We did not find any message with the given messageId, report this back
                return false;
            }
        }

        [HttpGet]
        public bool CheckMessage(string msgID) 
        {
            var msg = Context.getInstance().Messages.Where(m => m.Mail.Headers.MessageId == msgID).First();
            if (msg.IsRead)
            {
                msg.IsRead = false;
            }
            else {
                msg.IsRead = true;
            }
            return msg.IsRead;
        }

        [HttpPost]
        public bool SendMail(string subject, string to, string priority, string message, string username, string password) {
            try
            {
                MailMessage mailMsg = new MailMessage();
                mailMsg.From = new MailAddress(username);
                mailMsg.To.Add(to);
                mailMsg.Subject = subject;
                mailMsg.IsBodyHtml = true;
                mailMsg.BodyEncoding = Encoding.UTF8;
                mailMsg.Body = message;
                mailMsg.Priority = MailPriority.Normal;
                // Smtp configuration
                SmtpClient client = new SmtpClient();
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(username, password);
                client.Port = 587; //or use 465            
                client.Host = "smtp.gmail.com";
                client.EnableSsl = true;
                client.Send(mailMsg);
                return true;
            }
            catch (Exception ex) {
                return false;
            }
        }
    }

    public class MsgOverview {
        public int Index { get; set; }
        public string MsgId { get; set; }
        public string From { get; set; }
        public string Date { get; set; }
        public string Subject { get; set; }
    }
}
