import UIMedia, { MediaProps } from '@enact/ui/Media';
import HLS from 'hls.js';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import { convertToVTT } from 'utils/subtitles';

export type AudioTrack = {
  name: string;
  lang: string;
};

export type SourceTrack = {
  src: string;
  name: string;
};

export type SubtitleTrack = {
  src: string;
  name: string;
  lang: string;
};

class Media extends UIMedia {
  hls?: HLS;

  media!: HTMLMediaElement & {
    audioTracks?: { enabled?: boolean; label: string }[];
  };

  state!: {
    src: string;
  };

  props!: MediaProps & {
    startTime?: number;
    audioTracks?: AudioTrack[];
    sourceTracks: SourceTrack[];
    subtitleTracks?: SubtitleTrack[];
  };

  load(src: string) {
    let startTime = this.props.startTime;

    if (this.state?.src && this.state.src !== src) {
      startTime = this.media.currentTime;
    }

    this.destroy();

    const media = this.media;

    this.setState({ src });

    const handleLoaded = () => {
      if (startTime) {
        media.currentTime = startTime;
      }

      media.play();
    };

    if (src.includes('.m3u8') && HLS.isSupported()) {
      const hls = (this.hls = new HLS());

      hls.attachMedia(media);
      hls.on(HLS.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
        hls.on(HLS.Events.MANIFEST_PARSED, handleLoaded);
      });

      return;
    }

    media.src = src;
    media.addEventListener('loadedmetadata', handleLoaded);
  }

  get audioTracks() {
    if (this.hls) {
      return uniq(this.hls.audioTracks.map((audioTrack) => audioTrack.name));
    }

    return this.props.audioTracks?.map((audioTrack) => audioTrack.name);
  }

  get audioTrack() {
    if (this.hls) {
      return this.hls.audioTracks.find((audioTrack) => audioTrack.id === this.hls?.audioTrack)?.name!;
    }

    const audioTracksIndex = Array.from(this.media.audioTracks || []).findIndex((audioTrack) => audioTrack.enabled);

    return this.props.audioTracks?.[audioTracksIndex]?.name!;
  }

  set audioTrack(name: string) {
    if (this.hls) {
      const audioTrack = this.hls.audioTracks.find((audioTrack) => audioTrack.name === name);

      if (audioTrack) {
        this.hls.audioTrack = audioTrack.id;
      }
    } else {
      const audioTracks = Array.from(this.media.audioTracks || []);
      let audioTracksIndex = this.props.audioTracks?.findIndex((audioTrack) => audioTrack.name === name);

      if (!audioTracksIndex || audioTracksIndex > audioTracks.length - 1) {
        audioTracksIndex = 0;
      }

      audioTracks.forEach((audioTrack, idx) => {
        audioTrack.enabled = idx === audioTracksIndex;
      });
    }
  }

  get sourceTracks() {
    return uniqBy(this.props.sourceTracks, 'src').map((sourceTrack) => sourceTrack.name);
  }

  get sourceTrack() {
    return this.props.sourceTracks.find((sourceTrack) => sourceTrack.src === this.state.src)?.name!;
  }

  set sourceTrack(name: string) {
    const sourceTrack = this.props.sourceTracks.find((sourceTrack) => sourceTrack.name === name);

    if (sourceTrack) {
      this.load(sourceTrack.src);
    }
  }

  get subtitleTracks() {
    if (this.hls) {
      return this.hls.subtitleTracks.map((subtitleTrack) => subtitleTrack.name);
    }

    return this.props.subtitleTracks?.map((subtitleTrack) => subtitleTrack.name);
  }

  get subtitleTrack() {
    if (this.hls) {
      return this.hls.subtitleTracks.find((subtitleTrack) => subtitleTrack.id === this.hls?.subtitleTrack)?.name!;
    }

    return Array.from(this.media.textTracks || []).find((textTrack) => textTrack.mode === 'showing')?.label!;
  }

  set subtitleTrack(name: string) {
    if (this.hls) {
      this.hls.subtitleTrack = this.hls.subtitleTracks.find((subtitle) => subtitle.name === name)?.id ?? -1;
    } else {
      const textTracks = Array.from(this.media.textTracks || []);

      textTracks.forEach((textTrack) => {
        textTrack.mode = 'disabled';
      });

      const subtitleTrack = textTracks.find((textTrack) => textTrack.label === name);

      if (subtitleTrack) {
        subtitleTrack.mode = 'showing';
      } else {
        const subtitleTrack = this.props.subtitleTracks?.find((subtitleTrack) => subtitleTrack.name === name);

        if (subtitleTrack) {
          const track = document.createElement('track');

          track.kind = 'captions';
          track.id = subtitleTrack.name;
          track.srclang = subtitleTrack.lang;
          track.label = subtitleTrack.name;

          const showTrack = (src: string) => {
            track.src = src;
            track.track.mode = 'showing';
          };

          if (subtitleTrack.src.endsWith('.srt')) {
            convertToVTT(subtitleTrack.src).then(showTrack);
          } else {
            showTrack(subtitleTrack.src);
          }

          this.media.appendChild(track);
        }
      }
    }
  }

  private destroy() {
    if (this.hls) {
      this.hls.destroy();
    } else {
      this.media.src = '';
    }
  }

  componentDidMount() {
    this.load(this.props.sourceTracks[0].src);

    super.componentDidMount?.();
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    this.destroy();

    super.componentWillUnmount?.();
  }
}

export default Media;
