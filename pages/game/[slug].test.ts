import { mountSuspended } from '@nuxt/test-utils/runtime'

import LeaderboardInfo from '~/components/blocks/LeaderboardInfo/LeaderboardInfo.vue'
import Slug from './[slug].vue'

const mockSuccessGetLeaderboardBySlug = vi.fn(() =>
  Promise.resolve({ ok: true }),
)

const mockNotFound = vi.fn(() => Promise.resolve({ ok: false }))

describe('Slug Page', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a valid slug without crashing', async () => {
    vi.mock('lib/api/Leaderboards', () => ({
      Leaderboards: function Leaderboards() {
        this.getLeaderboardBySlug = mockSuccessGetLeaderboardBySlug
      },
    }))
    const wrapper = await mountSuspended(Slug)
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.getComponent(LeaderboardInfo).isVisible()).toBe(true)
    expect(mockSuccessGetLeaderboardBySlug).toHaveBeenCalledOnce()
  })

  it('renders a 404 with invalid slug', async () => {
    vi.mock('lib/api/Leaderboards', () => ({
      Leaderboards: function Leaderboards() {
        this.getLeaderboardBySlug = mockNotFound
      },
    }))
    const wrapper = await mountSuspended(Slug)
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.text()).toContain('404')
    expect(wrapper.getComponent(LeaderboardInfo).isVisible()).toBe(false)
    expect(mockNotFound).toHaveBeenCalledOnce()
  })
})
