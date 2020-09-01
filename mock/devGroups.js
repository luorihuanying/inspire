const group1 = [
  {
    gName: 'group1',
    date: new Date(),
    devsTotal: 10,
    desc: 'group1 desc',
    position: [12, 24]
  },
  {
    gName: 'group2',
    date: new Date(),
    devsTotal: 10,
    desc: 'group-2 desc',
    position: [12, 24]
  }
]

const group2 = [
  {
    gName: 'group-1',
    date: new Date(),
    devsTotal: 10,
    desc: 'group1 desc',
    position: [12, 24]
  },
  {
    gName: 'group-2',
    date: new Date(),
    devsTotal: 10,
    desc: 'group-2 desc',
    position: [12, 24]
  }
]
const reg = [
  {
    regName: '一区',
    date: new Date(),
    groupInfo: group1,
    layerUrl: 'https://ftp.bmp.ovh/imgs/2020/03/cd58c169f68fc13f.png',
    desc: '项目基地一,主要植被为香蕉',
    localtion: '广西民族大学西校区广西壮族自治区南宁市西乡塘区 ',
    regRange: 2000,
    polotsTotal: 3,
    position: [1.2, 334]
  },
  {
    regName: 'regName-2',
    layerUrl: 'https://ftp.bmp.ovh/imgs/2020/03/cd58c169f68fc13f.png',
    groupInfo: group2,
    desc: 'regName desc',
    localtion: 'regName localtion ',
    regRange: 2312,
    polotsTotal: 3,
    date: new Date(),
    position: [1.2, 334]
  }
]
export default [
  {
    url: '/cms/getGroupInfo/',
    type: 'get',
    response: config => {
      return {
        code: 2000,
        data: reg
      }
    }
  },
  {
    url: '/cms/createRegInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/updateRegInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/delRegInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/createGroupInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },

  {
    url: '/cms/updateGroupInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  },
  {
    url: '/cms/delGroupInfo/',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        msg: 'ok'
      }
    }
  }
]
