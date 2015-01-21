using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebApplicationAPI.Models
{
    public class MeuContext : DbContext
    {
        public MeuContext()
            : base("name=MeuContext")
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }

    }
}