using Microsoft.Data.Sqlite;
using System;
using System.Data;

namespace backend.Repositories
{
    /// <summary>
    /// Helpful wrapper class for creating and ADO.NET connection.
    /// </summary>
    public class DbConnection : IDisposable
    {
        private readonly SqliteConnection conn;

        /// <summary>
        /// Initializes a new instance of the <see cref="DbConnection"/> class.
        /// </summary>
        /// <param name="connectionString">The connection string for the database to connect to.</param>
        public DbConnection(string connectionString)
        {
            conn = new SqliteConnection(connectionString);
            conn.Open();
        }

        /// <summary>
        /// Creates a SQL command.
        /// </summary>
        /// <param name="filename">The filename of the 'command'.</param>
        /// <returns>A SqliteCommand to run the supplied query</returns>
        public SqliteCommand CreateCommand(string filename)
        {
            string query = System.IO.File.ReadAllText("Database/" + filename);
            SqliteCommand command = conn.CreateCommand();
            command.CommandText = query;
            return command;
        }

        /// <summary>
        /// Closes the underlying ADO.NET connection.
        /// </summary>
        public void Dispose()
        {
            conn.Close();
            conn.Dispose();
        }
    }
}
