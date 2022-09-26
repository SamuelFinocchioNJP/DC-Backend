const defaultServer = "https://emkc.org";
import fetch from "node-fetch";

const get = async (url) => {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch(e) {
    return { success: false, error: e };
  }
}

const post = async (url, body) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch(e) {
    return { success: false, error: e };
  }
}

export const piston = (opts:any = {}) => {
  const server = String(opts.server || defaultServer).replace(/\/$/, '');
  const store: any = {};

  const api = {

    async runtimes() {
      if (store.runtimes) {
        return store.runtimes;
      }
      const suffix = (server === defaultServer)
        ? '/api/v2/piston/runtimes'
        : '/api/v2/runtimes';
      const url = `${server}${suffix}`;
      const runtimes = await get(url);
      if (runtimes && runtimes.success !== false) {
        store.runtimes = runtimes;
      }
      return runtimes;
    },

    async execute(argA, argB, argC:any = {}) {
      const runtimes = await api.runtimes();
      if (runtimes.success === false) {
        return runtimes;
      }

      const config = typeof argA === 'object' ?
         argA : 
         typeof argB === 'object' ? argB : argC;
      let language = (typeof argA === 'string') ? argA : undefined;
      language = language || config.language;
      const code = typeof argB === 'string' ? argB : undefined;
      const latestVersion = (runtimes.filter(n => n.language === language).sort((a, b) => {
        return a.version > b.version ? -1 : b.version > a.version ? 1 : 0;
      })[0] || {}).version;

      const boilerplate = {
        "language": language,
        "version": config.version || latestVersion,
        "files": config.files ?? [{
            "content": code
        }],
        "stdin": config.stdin ?? "",
        "args": config.args ?? ["1", "2", "3"],
        "compile_timeout": config.compileTimeout ?? 10000,
        "run_timeout": config.runTimeout ?? 3000,
        "compile_memory_limit": config.compileMemoryLimit ?? -1,
        "run_memory_limit": config.runMemoryLimit ?? -1,
      }

      const suffix = (server === defaultServer)
        ? '/api/v2/piston/execute'
        : '/api/v2/execute';
      const url = `${server}${suffix}`;
      return await post(url, boilerplate);
    }
  }

  return api;
}

export default piston;