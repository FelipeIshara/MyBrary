FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)
FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})
//transforma os inputsfiles em fileponds inputs
FilePond.parse(document.body);