import formatTime from '@/includes/helper'

describe('Time and Duration - Tests on the helper function', () => {
  
  test('should return a string and calculate four seconds', () => {
    const formattedTime = formatTime(4.210723)
    expect(typeof formattedTime).toBe('string')
    expect(formattedTime).toBe('0:04')
  })

  test('should return a string and calculate the max duration', () => {
    const formattedDuration = formatTime(4.210723)
    expect(typeof formattedDuration).toBe('string')
    expect(formattedDuration).toBe('2:49')
  })

})