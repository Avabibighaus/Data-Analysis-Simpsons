import embed, { VisualizationSpec } from 'vega-embed';
import {parse} from 'csv-parse/browser/esm/sync';

const characterName: string = await (await fetch('https://raw.githubusercontent.com/rfordatascience/tidytuesday/main/data/2025/2025-02-04/simpsons_characters.csv')).text();
const characterData = parse (characterName, {columns: true})

interface EpisodeData {
  id: string,  
  number_in_season: string,
  us_viewers_in_millions:string,
  imdb_rating:string,
  season:string,
}
const episodes: string = await (await fetch('https://raw.githubusercontent.com/rfordatascience/tidytuesday/main/data/2025/2025-02-04/simpsons_episodes.csv')).text();
const episodeData:EpisodeData[] = parse (episodes, {columns: true})

const locations: string = await (await fetch('https://raw.githubusercontent.com/rfordatascience/tidytuesday/main/data/2025/2025-02-04/simpsons_locations.csv')).text();
const locationData = parse (locations, {columns: true})

interface ScriptLine {
  id: string;
  episode_id: string;
  raw_character_text: string;
  speaking_line: string;
}
const scriptLines: string = await (await fetch('https://raw.githubusercontent.com/rfordatascience/tidytuesday/main/data/2025/2025-02-04/simpsons_script_lines.csv')).text();
const linesData: ScriptLine[] = parse (scriptLines, {columns: true})

console.log(characterData);
console.log(episodeData);
console.log(locationData);
console.log(linesData);

const twentyFirstSeason =episodeData.filter(n=>n.season==='21')
console.log("episodeData", episodeData[0]);

const vis: VisualizationSpec = {
  data: {
    values:twentyFirstSeason
  },
  mark: {
    type: 'line'
  },
  encoding: {
    x: {
      field: 'number_in_season',
      type: 'quantitative',
      title: 'Episode (Season 21)',
      scale: {
        domain: [1, 23]
      }
    },
    y: {
      field: 'us_viewers_in_millions',
      type: 'quantitative',
      title: 'Views in Millions in the U.S.'    
      }
    },
    title: "Number of Views in Millions recorded in the U.S. per Episode (Season 21)"
    };

embed('#chart1', vis);

const simpsonFamily = [
  "Homer Simpson",
  "Marge Simpson",
  "Bart Simpson",
  "Lisa Simpson",
  "Maggie Simpson"
];

const simpsonCounts = twentyFirstSeason.map(ep => {
  return simpsonFamily.map(character => {

    const count = linesData.filter(line =>
      line.episode_id === ep.id && line.raw_character_text === character && line.speaking_line === "TRUE"
    ).length;

    return {
      episode: Number(ep.number_in_season),
      character: character,
      line_count: count
    };
  });
});


let simpsonLineCounts: any[] = [];
simpsonCounts.map(group => {
  simpsonLineCounts = simpsonLineCounts.concat(group);
});

const vis2: VisualizationSpec = {
  data: { 
    values: simpsonLineCounts 
  },
  mark: { 
    type: "line", 
    point: true 
  },
  encoding: {
    x: { 
      field: "episode", 
      type: "quantitative", 
      title: "Episode (Season 21)",
      scale: {
        domain: [1, 23]
      }
    },
    y: { 
      field: "line_count", 
      type: "quantitative", 
      title: "Lines Spoken",
      scale: {
        domain: [0, 100]
      }
    },
    color: { 
      field: "character", 
      type: "nominal" 
    }
  },
  title: "Number of Lines Spoken per Episode (Season 21)"
};

embed("#chart2", vis2);

const visthree: VisualizationSpec = {
  data: {
    values:twentyFirstSeason
  },
  "mark": {
    type: 'point'},
    encoding: {
  x: {
    field: 'number_in_season',
    type: 'quantitative',
    title: 'Episode (Season 21)',
    },
  y: {
    field: "imdb_rating",
    type: "quantitative",
    title: "IMDb Ratings",
    scale: {
        domain: [0, 10]
    }
    }
  },
  title: "IMDb Ratings per Episode (Season 21)" 
};
embed('#chart3', visthree);

