import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'x60kx28g',
    dataset: 'production',
  },
  deployment: {
    appId: 'r86ydzb2trym56nx1i4kpmo0',
    autoUpdates: true,
  },

  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  studioHost: 'unipal',
})
