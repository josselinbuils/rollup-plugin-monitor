import { Plugin } from 'rollup';
import { PLUGIN_METHODS, PLUGIN_NAME } from './constants';

export default function monitor(): Plugin {
  const executionTimes = {} as { [plugin: string]: number };

  return {
    name: PLUGIN_NAME,
    buildStart({ plugins }) {
      if (plugins === undefined) {
        return;
      }

      plugins.forEach((plugin) => {
        const name = (plugin as any).pluginName || plugin.name;

        if (name === PLUGIN_NAME) {
          return;
        }

        executionTimes[name] = 0;

        PLUGIN_METHODS.forEach((pluginMethod) => {
          const originalMethod = plugin[pluginMethod] as any;

          if (typeof originalMethod === 'function') {
            (plugin as any)[pluginMethod] = function (...args: any[]) {
              const startTime = process.hrtime();
              const result = originalMethod.apply(this, args);

              if (result instanceof Promise) {
                result.then(() => {
                  executionTimes[name] += getDurationMs(startTime);
                });
              } else {
                executionTimes[name] += getDurationMs(startTime);
              }
              return result;
            };
          }
        });
      });
    },
    writeBundle() {
      const sortedExecutionTimes = Object.entries(executionTimes)
        .map(([name, executionTime]) => ({
          executionTime: Math.ceil(executionTime),
          name,
        }))
        .sort((a, b) =>
          a.executionTime > b.executionTime
            ? -1
            : b.executionTime > a.executionTime
            ? 1
            : 0
        );

      console.log(sortedExecutionTimes);
    },
  };
}

function getDurationMs(startTime: [number, number]): number {
  const [seconds, nanoseconds] = process.hrtime(startTime);
  return (seconds * 1e9 + nanoseconds) / 1e6;
}
