const page = `Page({
    data: {},
    onShow() {}
});
`;

const com = `Component({
    relations: {},
    properties: {},
    options: {},
    methods: {},
    ready() {}
});`;

const pageJson = `{
    "backgroundTextStyle": "black",
    "navigationBarTitleText": "新页面",
    "usingComponents": {

    }
}
`;
const comJson = `
{
    "component": true
}
`;

const wxml = `<view class="wrapper">

</view>
`;

const wxss = ``;

module.exports = {
    page: page,
    com: com,
    pageJson: pageJson,
    comJson: comJson,
    wxml: wxml,
    wxss: wxss
};