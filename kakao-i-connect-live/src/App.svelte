<script lang="ts">
  import ConnectLive from '@connectlive/connectlive-web-sdk'

  let localMedia = null
  let conf = null
  let checkActiveSpeaker = null
  let users = []

  const roomId = 'awesome-dale'

  const createConference = async () => {
    conf = ConnectLive.createConference()
    if (!conf) throw new Error('Fail to Create Conference')

    conf.on('connected', (evt) => {
      evt.remoteParticipants.forEach(async (remoteParticipant) => addUserNode(remoteParticipant.id, 'remote'))
    })

    conf.on('participantEntered', (evt) => {
      const {remoteParticipant} = evt

      addUserNode(remoteParticipant.id, 'remote')
      addLog(`${remoteParticipant.id} Joined`)
    })

    conf.on('participantLeft', (evt) => {
      removeUserNode(evt.remoteParticipantId)
    })
  }

  const addUserNode = (id, who = '') => {
    const user = {id, who}
    users = [...users, user]
  }

  const removeUserNode = (remoteParticipantId) => {
    users = users.filter((user) => {
      if (user.id !== remoteParticipantId) return true
      addLog(`${remoteParticipantId} Left`)
      return false
    })
  }

  const resetUserNode = () => (users = [])

  const addLog = (text) => console.log(text)

  const connectConference = async () => {
    try {
      await ConnectLive.signIn({
        host: import.meta.env.VITE_SERVICE_HOST,
        serviceId: import.meta.env.VITE_SERVICE_ID,
        serviceKey: import.meta.env.VITE_SERVICE_KEY,
        secret: import.meta.env.VITE_SERVICE_SECRET
      })

      localMedia = await ConnectLive.createLocalMedia({
        audio: true
      })

      await createConference()
      addLog('Conference Created')

      if (!conf || !localMedia) throw new Error('No Conference to Connect')

      await conf.connect(roomId)
      conf.publish([localMedia])
      addLog('Voice Connected')

      addUserNode(conf.localParticipant.id, 'local')
      addLog('Participant Showed')

      // handleActiveSpeaker()
      addLog('Active Speaker Check Started')
    } catch (error) {
      console.error(error)
      alert('Failed to Start Service')
    }
  }

  const disConnectConference = () => {
    try {
      if (!conf || !localMedia) throw new Error('No Conference to Stop')

      clearInterval(checkActiveSpeaker)
      addLog('Active Speaker Check Stopped')

      conf.disconnect()
      addLog('Conference Disconnected')

      localMedia.stop()
      localMedia = null
      addLog('Voice Disconnected')

      resetUserNode()
      addLog('Participants Cleared')

      ConnectLive.signOut()
      addLog('User Signed Out')
    } catch (error) {
      console.error(error)
    }
  }
</script>

<main>
  <h1>Hello Awesome Dale!</h1>
  <div class="hbox">
    <div class="pack w(100) c(white) bg(rgb(96,165,250)) pointer" on:click={connectConference}>Connect</div>
    <div class="pack w(100) c(white) bg(rgb(248,113,113)) pointer" on:click={disConnectConference}>Disconnect</div>
  </div>
  <div>
    {#each users as user}
      <div>{user.id} : {user.who}</div>
    {/each}
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
