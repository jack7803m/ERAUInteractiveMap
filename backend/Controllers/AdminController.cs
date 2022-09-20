using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ILogger<AdminController> _logger;
        private readonly MapDataRepository _repo;

        public AdminController(ILogger<AdminController> logger, MapDataRepository mapDataRepository)
        {
            _logger = logger;
            _repo = mapDataRepository;
        }

        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<POI>> Get()
        {
            

            return await _repo.GetAllPOIs();
        }
    }
}
