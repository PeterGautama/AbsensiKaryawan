/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path")

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: "empty",
    },
  })
}

// exports.onCreatePage = async ({ page, actions }) => {
//   const { createPage } = actions
//
//   // page.matchPath is a special key that's used for matching pages
//   // only on the client.
//   if (
//     page.path.match(/^\/dashboard\/profile/) ||
//     page.path.match(/^\/kpi-frontend\/dashboard\/profile/)
//   ) {
//     // Update the page.
//     createPage({
//       path: "/dashboard/profile",
//       matchPath: "/dashboard/profile/:user_id",
//       component: path.resolve(`src/pages/dashboard/profile.js`),
//     })
//   } else {
//     createPage(page)
//   }
// }
