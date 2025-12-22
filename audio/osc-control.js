autowatch = 1;
outlets = 1;

var liveObject = new LiveAPI();

function start_scene(sceneIndex) {
  // post('start_scene', sceneIndex, '\n');
  liveObject.path = 'live_set scenes ' + sceneIndex;
  liveObject.call('fire');
}

function start_clip(trackIndex, clipIndex) {
  // post('start_clip', trackIndex, clipIndex, '\n');
  liveObject.path = 'live_set tracks ' + trackIndex + ' clip_slots ' + clipIndex;
  liveObject.call('fire');
}

function stop_all() {
  liveObject.path = 'live_set';
  liveObject.call('stop_all_clips', 0);
  liveObject.call('stop_playing');
}
