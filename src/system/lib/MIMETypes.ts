import { Library } from '../../types'

const MIMETypes: Library = {
  config: {
    name: 'MIMETypes',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k, p) => {},
  data: {
    aac: {
      type: 'audio/aac',
      description: 'AAC Audio',
      opensWith: ['apps/MusicPlayer'],
      icon: 'audio_file'
    },
    abw: {
      type: 'application/x-abiword',
      description: 'AbiWord Document',
      opensWith: ['apps/Editor'],
      icon: 'description'
    },
    apng: {
      type: 'image/apng',
      description: 'Animated PNG File',
      opensWith: ['apps/ImageViewer'],
      icon: 'image'
    },
    app: {
      type: 'application/x-flow-executable',
      description: 'FlowOS Application',
      opensWith: [],
      icon: 'deployed_code'
    },
    /* arc: {
      type: 'application/x-freearc',
      description: 'Archive Document',
      opensWith: ['apps/ArchiveViewer'],
      icon: 'archive'
    }, */
    avif: {
      type: 'image/avif',
      description: 'AVIF Image',
      opensWith: ['apps/ImageViewer'],
      icon: 'image'
    },
    lnk: {
      type: 'application/x-ms-shortcut',
      description: 'Windows Shortcut',
      opensWith: [],
      icon: 'file_present'
    },
    md: {
      type: 'text/markdown',
      description: 'Markdown Document',
      opensWith: ['apps/Editor'],
      icon: 'markdown'
    },
    mp4: {
      type: 'video/mp4',
      description: 'MP4 Video',
      opensWith: ['apps/VideoPlayer'],
      icon: 'video_file'
    },
    png: {
      type: 'image/png',
      description: 'PNG File',
      opensWith: ['apps/ImageViewer'],
      icon: 'image'
    },
    svg: {
      type: 'image/svg+xml',
      description: 'SVG File',
      opensWith: ['apps/ImageViewer'],
      icon: 'image'
    },
    txt: {
      type: 'text/plain',
      description: 'Text Document',
      opensWith: ['apps/Editor'],
      icon: 'description'
    }
  }
}

export default MIMETypes
