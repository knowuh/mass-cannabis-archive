import { useState, useMemo, useEffect } from 'preact/hooks';

interface LicenseRecord {
  LICENSE_NUMBER: string;
  BUSINESS_NAME: string;
  LICENSE_TYPE: string;
  LICENSE_STATUS: string;
  ESTABLISHMENT_CITY: string;
  ESTABLISHMENT_COUNTY: string;
  BUSINESS_EMAIL?: string;
  BUSINESS_PHONE?: string;
  DBE?: string;
  PRIORITY_REVIEW_TYPE?: string;
  [key: string]: any;
}

export default function LicenseSearch() {
  const [allData, setAllData] = useState<LicenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    county: '',
    city: '',
    dbe: '',
    priority: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLicense, setSelectedLicense] = useState<LicenseRecord | null>(null);
  const itemsPerPage = 50;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/mass-cannabis-archive/data/ccc/latest.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setAllData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return allData.filter(row => {
      const matchesSearch = !searchTerm || 
        row.BUSINESS_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.BUSINESS_EMAIL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.ESTABLISHMENT_CITY?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !filters.type || row.LICENSE_TYPE === filters.type;
      const matchesCounty = !filters.county || row.ESTABLISHMENT_COUNTY === filters.county;
      const matchesCity = !filters.city || row.ESTABLISHMENT_CITY === filters.city;
      const matchesDbe = !filters.dbe || row.DBE === filters.dbe;
      const matchesPriority = !filters.priority || row.PRIORITY_REVIEW_TYPE === filters.priority;

      return matchesSearch && matchesType && matchesCounty && matchesCity && matchesDbe && matchesPriority;
    });
  }, [allData, searchTerm, filters]);

  // Derived options for filters based on CURRENT filtered data (AND-oriented)
  const dropdownOptions = useMemo(() => {
    const getOptions = (key: keyof LicenseRecord, otherFilters: any) => {
      const possibleData = allData.filter(row => {
        const matchesSearch = !searchTerm || 
          row.BUSINESS_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.BUSINESS_EMAIL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.ESTABLISHMENT_CITY?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = !otherFilters.type || row.LICENSE_TYPE === otherFilters.type;
        const matchesCounty = !otherFilters.county || row.ESTABLISHMENT_COUNTY === otherFilters.county;
        const matchesCity = !otherFilters.city || row.ESTABLISHMENT_CITY === otherFilters.city;
        const matchesDbe = !otherFilters.dbe || row.DBE === otherFilters.dbe;
        const matchesPriority = !otherFilters.priority || row.PRIORITY_REVIEW_TYPE === otherFilters.priority;

        return matchesSearch && matchesType && matchesCounty && matchesCity && matchesDbe && matchesPriority;
      });

      return [...new Set(possibleData.map(item => item[key]))]
        .filter(v => v && v !== "")
        .sort();
    };

    return {
      types: getOptions('LICENSE_TYPE', { ...filters, type: '' }),
      counties: getOptions('ESTABLISHMENT_COUNTY', { ...filters, county: '' }),
      cities: getOptions('ESTABLISHMENT_CITY', { ...filters, city: '' }),
      dbes: getOptions('DBE', { ...filters, dbe: '' }),
      priorities: getOptions('PRIORITY_REVIEW_TYPE', { ...filters, priority: '' })
    };
  }, [allData, searchTerm, filters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const pageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(f => {
      const newFilters = { ...f, [key]: value };
      if (key === 'county') newFilters.city = ''; // Reset city when county changes
      return newFilters;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ type: '', county: '', city: '', dbe: '', priority: '' });
    setSelectedLicense(null);
    setCurrentPage(1);
  };

  if (loading) return <div class="loading-state">Initializing archive...</div>;
  if (error) return <div class="error-state">Error: {error}</div>;

  return (
    <div class="archive-wrapper">
      <div class="data-browser">
        <div class="controls">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Search Business Name, Email, or City..." 
              value={searchTerm}
              onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
            />
            <button onClick={clearFilters} class="clear-btn">Clear Filters</button>
          </div>
          <div class="filters">
            <FilterSelect 
              label="Type" 
              value={filters.type} 
              options={dropdownOptions.types} 
              onChange={(v) => handleFilterChange('type', v)} 
              placeholder="All Types"
            />
            <FilterSelect 
              label="County" 
              value={filters.county} 
              options={dropdownOptions.counties} 
              onChange={(v) => handleFilterChange('county', v)} 
              placeholder="All Counties"
            />
            <FilterSelect 
              label="City" 
              value={filters.city} 
              options={dropdownOptions.cities} 
              onChange={(v) => handleFilterChange('city', v)} 
              placeholder="All Cities"
            />
            <FilterSelect 
              label="DBE Status" 
              value={filters.dbe} 
              options={dropdownOptions.dbes} 
              onChange={(v) => handleFilterChange('dbe', v)} 
              placeholder="All Statuses"
            />
            <FilterSelect 
              label="Priority" 
              value={filters.priority} 
              options={dropdownOptions.priorities} 
              onChange={(v) => handleFilterChange('priority', v)} 
              placeholder="All Priorities"
            />
          </div>
        </div>

        <div class="stats-bar">
          <div class="count-info">
            Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
          </div>
          <div class="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        </div>

        <div class="table-scroll-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Business Name</th>
                <th style={{ width: '15%' }}>Location</th>
                <th style={{ width: '18%' }}>Type</th>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '17%' }}>Equity/Priority</th>
                <th style={{ width: '10%' }}>Open</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(row => (
                <tr 
                  key={row.LICENSE_NUMBER} 
                  class={`clickable-row ${selectedLicense?.LICENSE_NUMBER === row.LICENSE_NUMBER ? 'selected' : ''}`}
                  onClick={() => setSelectedLicense(row)}
                >
                  <td class="business-name">{row.BUSINESS_NAME}</td>
                  <td class="mono">
                    <a 
                      href={`/mass-cannabis-archive/county/${row.ESTABLISHMENT_COUNTY?.toLowerCase().replace(/ /g, '-')}`} 
                      class="geo-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.ESTABLISHMENT_COUNTY?.replace(' County', '')}
                    </a>
                  </td>
                  <td class="type-cell">{row.LICENSE_TYPE}</td>
                  <td>
                    <span class={`status-tag`} data-status={row.LICENSE_STATUS?.toLowerCase()}>
                      {row.LICENSE_STATUS}
                    </span>
                  </td>
                  <td class="mono small-text">
                    {row.DBE !== 'Not a DBE' ? 'DBE' : ''} 
                    {row.PRIORITY_REVIEW_TYPE ? ` | ${row.PRIORITY_REVIEW_TYPE}` : ''}
                  </td>
                  <td class="mono">{row.COMMENCE_OPS === 'Yes' ? '✓' : '—'}</td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colspan={6} class="empty">No matching records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div class="details-pane">
        <div class="pane-header">
          <h2>Record Details</h2>
          {selectedLicense && (
             <a href={`/mass-cannabis-archive/license/${selectedLicense.LICENSE_NUMBER}`} class="history-link">View Full History →</a>
          )}
        </div>
        <div class="details-content">
          {selectedLicense ? (
            <LicenseDetails record={selectedLicense} />
          ) : (
            <div class="placeholder-msg">Select a record to view full details</div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange, placeholder }: any) {
  return (
    <div class="filter-group">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange((e.target as HTMLSelectElement).value)}>
        <option value="">{placeholder}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function LicenseDetails({ record }: { record: LicenseRecord }) {
  const groups = [
    {
      title: 'License Lifecycle',
      keys: ['LICENSE_STATUS', 'APPROVED_LICENSE_STAGE', 'COMMENCE_OPERATIONS_DATE', 'LIC_EXPIRATION_DATE', 'LIC_ORIGINAL_START_DATE']
    },
    {
      title: 'Equity & Priority',
      keys: ['REVIEW_PRIORITY', 'DBE', 'APPROVED_SOCIAL_EQUITY', 'EE_PRIORITY_STATUS', 'RMD_PRIORITY_STATUS']
    },
    {
      title: 'Location & Contact',
      keys: ['ESTABLISHMENT_ADDRESS_1', 'ESTABLISHMENT_CITY', 'ESTABLISHMENT_ZIP', 'ESTABLISHMENT_COUNTY', 'BUSINESS_EMAIL', 'BUSINESS_PHONE']
    },
    {
      title: 'Operational Details',
      keys: ['INDUSTRY', 'CULTIVATION_TIER', 'CULTIVATION_ENVIRONMENT', 'COMMENCE_OPS']
    }
  ];

  return (
    <>
      {groups.map(group => {
        const items = Object.entries(record)
          .filter(([key, val]) => group.keys.includes(key) && val && val !== "N/A" && val !== "")
          .sort((a, b) => group.keys.indexOf(a[0]) - group.keys.indexOf(b[0]));

        if (items.length === 0) return null;

        return (
          <div class="detail-group" key={group.title}>
            <h3>{group.title}</h3>
            <div class="group-items">
              {items.map(([key, value]) => (
                <div class="detail-item" key={key}>
                  <div class="detail-key">{key.replace(/_/g, ' ')}</div>
                  <div class="detail-value">{value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
