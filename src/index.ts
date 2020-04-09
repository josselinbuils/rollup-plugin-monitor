import { Plugin } from 'rollup';

const MIN_DURATION = 1;

export default function monitor(): Plugin {
  const transformCalls = [] as TransformCall[];

  return {
    name: 'monitor',
    buildStart({ plugins }) {
      if (plugins === undefined) {
        return;
      }

      plugins.forEach((plugin) => {
        if (typeof plugin.transform === 'function') {
          const { name, transform } = plugin;

          plugin.transform = function (code, id) {
            const startTime = Date.now();
            const result = transform.call(this, code, id);
            const duration = Date.now() - startTime;

            if (duration >= MIN_DURATION) {
              transformCalls.push({
                duration,
                filePath: id,
                pluginName: name,
              });
            }
            return result;
          };
        }
      });
    },
    writeBundle() {
      const fileStats = {} as {
        [filePath: string]: { duration: number; pluginName: string }[];
      };

      transformCalls.sort((a, b) => {
        if (a.filePath === b.filePath) {
          return a.pluginName < b.pluginName
            ? -1
            : a.pluginName > b.pluginName
            ? 1
            : 0;
        }
        return a.filePath < b.filePath ? -1 : a.filePath > b.filePath ? 1 : 0;
      });

      transformCalls.forEach(({ duration, filePath, pluginName }) => {
        if (fileStats[filePath] === undefined) {
          fileStats[filePath] = [];
        }
        fileStats[filePath].push({ duration, pluginName });
      });

      console.log(fileStats);
    },
  };
}

interface TransformCall {
  duration: number;
  filePath: string;
  pluginName: string;
}
