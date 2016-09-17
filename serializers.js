export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    songs: { embedded: 'always' }
  }
});