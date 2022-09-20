using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;

namespace backend.Repositories
{
    public class MapDataRepository
    {
        private readonly DbConnection conn;

        public MapDataRepository(IConfiguration config)
        {
            conn = new DbConnection(config["ConnectionString"]);
        }

        public async Task<List<POI>> GetAllPOIs()
        {
            using SqliteCommand cmd = conn.CreateStoredProc("sp_GetAllPOIs");

            using SqliteDataReader reader = await cmd.ExecuteReaderAsync();
            List<POI> pois = new List<POI>();
            while (await reader.ReadAsync())
            {
                pois.Add(new POI());
            }

            return pois;
        }

        public async Task<List<POI>> GetPOIsByType(string type)
        {
            using SqliteCommand cmd = conn.CreateStoredProc("sp_GetPOIsByType");
            cmd.Parameters.AddWithValue("@type", type);

            using SqliteDataReader reader = await cmd.ExecuteReaderAsync();
            List<POI> pois = new List<POI>();
            while (await reader.ReadAsync())
            {
                pois.Add(new POI());
            }

            return pois;
        }

        public async Task AddPOI(POI poi)
        {
            using SqliteCommand cmd = conn.CreateStoredProc("sp_AddPOI");
            cmd.Parameters.AddWithValue("@name", poi.Name);
            cmd.Parameters.AddWithValue("@type", poi.Type);
            cmd.Parameters.AddWithValue("@description", poi.Description);
            cmd.Parameters.AddWithValue("@x", poi.Latitude);
            cmd.Parameters.AddWithValue("@y", poi.Longitude);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}