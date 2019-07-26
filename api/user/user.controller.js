import Models, { 
  Event,
  User,
  EventType,
  UserInterest,
  UserEvent,
  Gender,
  Location
} from '../models'

async function getProfile(req, res) {
  let userId = req.params.id || req.user.id
  console.log(userId)

  const user = await User.findByPk(userId, {
    include: [
      {
        model: Gender,
        as: 'gender',
        attributes: ['name']
      },
      {
        model: Location,
        as: 'location'
      }
    ]
  })
  const eventsOptions = {
    include: [
      { 
        model: EventType, 
        as: 'event_type',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'participants',
        through: {
          attributes: []
        },
        attributes: ['id', 'username', 'name', 'userpic']
      },
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'userpic']
      },
    ],
    attributes: ['id', 'description', 'capacity', 'vacant', 'start_ts', 'end_ts', 'cost']    
  }

  const events = await user.getEvents(eventsOptions)
  const participatedEvents = await user.getParticipated_events(eventsOptions)
  const interests = await user.getInterests()
  return res.json({
    ...user.toJSON(),
    events: events || [],
    participated_events: participatedEvents || [],
    interests: interests || []
  })
}

async function setProfile(req, res) {
  console.log('setProfile')
  console.log(req.params.id) // TODO for admin use only in future
  const id = req.user.id
  const user = await User.findByPk(id)
  const { location, ...userProfileData } = req.body
  console.log(user)
  await user.update({
    ...user.dataValues,
    ...userProfileData
  })

  let userLocation

  if (location.here_location_id) {
    const locationsByIdList  = await Location.findAll({
      where: {
        here_location_id: location.here_location_id
      }
    })
    userLocation = locationsByIdList[0] || null
  }

  if (!userLocation) {
    userLocation = Location.build({
      ...location
    })
    await user.createLocation(location)
  } else {
    await user.setLocation(userLocation)
  }

  await user.reload()

  const events = await user.getEvents({
    include: [
      { 
        model: EventType, 
        as: 'event_type',
        attributes: ['id', 'name']
      }
    ],
    attributes: ['id', 'description', 'capacity', 'vacant', 'start_ts', 'end_ts', 'cost']
  })

  return res.json({
    ...user.toJSON(),
    events: events || []
  })
}

async function setPreferences(req, res) {
  const user = await User.findByPk(req.user.id)
  const { interests } = req.body

  console.log('interests', interests)

  await user.setInterests([])
  await user.setInterests(interests)

  await user.reload()

  const newInterests = await user.getInterests()

  return res.json({
    user: user.toJSON(),
    interests: newInterests
  })
}

async function getPreferences(req, res) {
  console.log('changeInterests')
  const user = await User.findByPk(req.user.id)

  const eventTypes = await user.getInterests()
  console.log(user, eventTypes)
  return res.json({
    user,
    interests: eventTypes
  })
}

async function createUserEvent(req, res) {
  const user_id = req.user.id
  const event_id = req.body.event_id
  const user_event_type_id = req.body.user_event_type_id
  console.log('createUserEvent')

  const userEvent = UserEvent.build({
    user_id,
    event_id,
    user_event_type_id
  })

  await userEvent.save()

  return res.json(userEvent.toJSON())
}

export default {
  getProfile,
  setProfile,
  getPreferences,
  setPreferences,
  createUserEvent
}
