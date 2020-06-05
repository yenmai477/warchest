/**
 * Parse URL by regex
 * @param u {string}
 * @param regex {regex}
 * @param pos {number}
 * @return {string}
 */
const regexProcess = (u, regex, pos = null) => {
  try {
    // console.log(`Parse ${u} with regex ${regex}`);
    const url = new URL(u);
    const { pathname } = url;

    const parsePathname = pathname.match(regex);

    if (parsePathname && pos !== null) return parsePathname[pos];
    return parsePathname;
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = regexProcess;
