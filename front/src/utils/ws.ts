export default class TownhallWs {
  ws: any;
  channel: any;
  uid: any;
  events: any;
  eventMap: any;
  closed = false;
  inited = false;
  constructor(uid: string, channel: string, events: any) {
    this.channel = channel;
    this.uid = uid;
    this.events = events;
    this.reconnect(events.onLoad);
  }

  inviteToSpeak(username: string, uid: string) {
    this.ws.send(
      JSON.stringify({
        type: 'bePublish',
        redirect: true,
        receiveId: uid,
        invitor: username,
      }),
    );
  }

  close() {
    this.closed = true;
    this.ws.close();
  }

  reconnect(onLoad: any) {
    this.ws = new WebSocket(`${process.env.VUE_APP_WS_URL}/${this.uid}`);
    this.ws.onopen = () => {
      if (this.inited) {
        onLoad();
      }
      if (!this.inited) {
        this.inited = true;
      }
    };

    const eventMap: any = {
      handsUp: 'onHandUp',
      handsCancel: 'onHandCancel',
      handsAgree: 'onHandReply',
      handsReject: 'onHandReply',
      joinRoom: 'onJoinroom',
      roleUpdate: 'onRoleUpdate',
      ['leave_room_other']: 'onLeaveRoom',
      ['close_room']: 'onCloseRoom',
      rePublish: 'onRemoveSpeaker',
      ['set_admin']: 'onBeModerator',
      setVoice: 'onMicMute',
      bePublish: 'onBeSpeaker',
      noticeVoiceUpdate: 'onMicChange',
      inviteResult: 'onIviteReject',
    };

    this.ws.onerror = (error: any) => {
      console.log(error);
    };
    this.ws.onmessage = (event: any) => {
      const info = JSON.parse(event.data);
      const { events } = this;

      const eventKey = eventMap[info?.type];
      if (!eventKey) {
        return;
      }
      events[eventKey](info);
    };
    this.ws.onclose = () => {
      if (this.closed) {
        return;
      }
      setTimeout(() => {
        this.reconnect(onLoad);
      }, 300);
    };
  }
}
