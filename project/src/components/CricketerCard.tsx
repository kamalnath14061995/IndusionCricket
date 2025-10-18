import React, { useState } from 'react';

interface CricketerStats {
  runs: number;
  wickets: number;
  matches: number;
  centuries: number;
  halfCenturies: number;
  strikeRate: number;
  economyRate: number;
  average: number;
  tournaments: string[];
}

interface TournamentPerformance {
  name: string;
  month: string;
  year: string;
  runs: number;
  wickets: number;
  matches: number;
}

type PlayerClassification =
  | 'TNCA_DIVISION'
  | 'DISTRICT'
  | 'DISTRICT_LEAGUE'
  | 'STATE'
  | 'NATIONAL'
  | 'INTERNATIONAL';

interface Cricketer {
  id: string;
  name: string;
  photo: string;
  achievements: string[];
  playerType: PlayerClassification[];
  represents: string[];
  tournaments: TournamentPerformance[];
  stats: {
    [year: string]: CricketerStats;
  };
}

interface CricketerCardProps {
  cricketer: Cricketer;
}

const PlayerTypeBadge: React.FC<{ type: PlayerClassification }> = ({ type }) => {
  const typeConfig = {
    TNCA_DIVISION: { label: 'TNCA Division', color: 'bg-blue-100 text-blue-800' },
    DISTRICT: { label: 'District', color: 'bg-green-100 text-green-800' },
    DISTRICT_LEAGUE: { label: 'District League', color: 'bg-purple-100 text-purple-800' },
    STATE: { label: 'State', color: 'bg-orange-100 text-orange-800' },
    NATIONAL: { label: 'National', color: 'bg-red-100 text-red-800' },
    INTERNATIONAL: { label: 'International', color: 'bg-yellow-100 text-yellow-800' },
  };

  const config = typeConfig[type] || typeConfig.DISTRICT;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      <Award className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

const RepresentsBadge: React.FC<{ represent: string }> = ({ represent }) => {
  // Define colors for different types of represents
  const getBadgeConfig = (rep: string) => {
    const indianStates = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
      'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
      'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    const cricketZones = ['North', 'South', 'East', 'West', 'Central'];

    if (indianStates.includes(rep)) {
      return { color: 'bg-indigo-100 text-indigo-800', icon: MapPin };
    } else if (cricketZones.includes(rep)) {
      return { color: 'bg-teal-100 text-teal-800', icon: Trophy };
    } else {
      return { color: 'bg-gray-100 text-gray-800', icon: MapPin };
    }
  };

  const config = getBadgeConfig(represent);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {represent}
    </span>
  );
};

const PlayerTypeBadges: React.FC<{ types: PlayerClassification[] }> = ({ types }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {types.map((type, index) => (
        <PlayerTypeBadge key={index} type={type} />
      ))}
    </div>
  );
};

const CricketerCard: React.FC<CricketerCardProps> = ({ cricketer }) => {
  const [showTournaments, setShowTournaments] = useState(false);
  const years = cricketer.stats ? Object.keys(cricketer.stats) : [];
  const latestYear = years.length > 0 ? years.sort().reverse()[0] : new Date().getFullYear().toString();
  const currentStats = cricketer.stats?.[latestYear] || {
    runs: 0,
    wickets: 0,
    matches: 0,
    tournaments: []
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-12 items-center gap-4 p-3">
        {/* Player Image - Round */}
        <div className="col-span-2">
          <img
            src={cricketer.photo}
            alt={cricketer.name}
            className="w-16 h-16 object-cover rounded-full mx-auto"
          />
        </div>
        
        {/* Player Details */}
        <div className="col-span-4">
          <h3 className="text-lg font-bold text-gray-900 truncate">{cricketer.name}</h3>
          <p className="text-green-600 font-medium text-sm">Star Player</p>
          <div className="text-xs text-gray-600 capitalize">
            {cricketer.playerType?.join(', ').toLowerCase().replace(/_/g, ' ')}
          </div>
          {cricketer.represents && cricketer.represents.length > 0 && (
            <div className="text-xs text-gray-600 truncate">
              Represents: {cricketer.represents.slice(0, 2).join(', ')}
              {cricketer.represents.length > 2 && ` +${cricketer.represents.length - 2}`}
            </div>
          )}
        </div>
        
        {/* Performance Stats */}
        <div className="col-span-4 text-center">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Latest Performance</h4>
          <div className="grid grid-cols-3 gap-1">
            <div className="text-center">
              <div className="text-sm font-bold text-blue-600">{currentStats.runs}</div>
              <div className="text-xs text-gray-500">Runs</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-red-600">{currentStats.wickets}</div>
              <div className="text-xs text-gray-500">Wickets</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-green-600">{currentStats.matches}</div>
              <div className="text-xs text-gray-500">Matches</div>
            </div>
          </div>
          {cricketer.tournaments && cricketer.tournaments.length > 0 && (
            <div className="mt-1">
              <div className="text-xs text-gray-600 truncate">
                {cricketer.tournaments[0].name} {cricketer.tournaments[0].year && `(${cricketer.tournaments[0].year})`}
              </div>
              {cricketer.tournaments.length > 1 && (
                <button 
                  onClick={() => setShowTournaments(!showTournaments)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                >
                  {showTournaments ? 'Hide' : `+${cricketer.tournaments.length - 1} more`} tournaments
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Status */}
        <div className="col-span-2 text-center">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>
      
      {/* Tournament Details Section - Horizontal Scroll */}
      {showTournaments && cricketer.tournaments && cricketer.tournaments.length > 0 && (
        <div className="border-t border-gray-200 p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">All Tournaments</div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{scrollbarWidth: 'thin'}}>
            {cricketer.tournaments.map((tournament, index) => (
              <div key={index} className="flex-shrink-0 bg-gray-50 rounded-lg p-3 min-w-[200px]">
                <h4 className="font-semibold text-gray-800 text-xs mb-1 truncate">{tournament.name}</h4>
                <div className="text-xs text-gray-600 mb-2">
                  {tournament.month} {tournament.year}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="font-bold text-blue-600 text-sm">{tournament.runs}</div>
                    <div className="text-xs text-gray-500">Runs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-red-600 text-sm">{tournament.wickets}</div>
                    <div className="text-xs text-gray-500">Wickets</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600 text-sm">{tournament.matches}</div>
                    <div className="text-xs text-gray-500">Matches</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CricketerCard;
