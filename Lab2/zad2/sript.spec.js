"use strict";

(() => {
  const expect = chai.expect

  describe('numbers function', () => {
    it('should return a sum of digits in a string containing only digits', () => {
      const res = numbers('123')
      expect(res).to.be.eq(6)
    })
    it('should return 0 for a string containing only letters', () => {
      const res = numbers('abcdef')
      expect(res).to.be.eq(0)
    })
    it('should return a sum of digits in a string that starts with letters', () => {
      const res = numbers('abcdef1234')
      expect(res).to.be.eq(10)
    })
    it('should return a sum of digits in a string that starts with digits', () => {
      const res = numbers('1234abcdef')
      expect(res).to.be.eq(10)
    })
    it('should return 0 if a string is empty', () => {
      const res = numbers('')
      expect(res).to.be.eq(0)
    })
  })

  describe('letters function', () => {
    it('should return 0 for a string containing only digits', () => {
      const res = letters('123')
      expect(res).to.be.eq(0)
    })
    it('should return length of a string in a string containing only letters', () => {
      const str = 'abcdef'
      const res = letters(str)
      expect(res).to.be.eq(str.length)
    })
    it('should return a number of letters in a string that starts with letters', () => {
      const res = letters('abcdef1234')
      expect(res).to.be.eq(6)
    })
    it('should return a number of letters in a string that starts with digits', () => {
      const res = letters('1234abcdef')
      expect(res).to.be.eq(6)
    })
    it('should return 0 if a string is empty', () => {
      const res = letters('')
      expect(res).to.be.eq(0)
    })
  })

  const sum = sumInit()
  let prevSum = 0

  describe('sum function', () => {
    it('should return a previously returned value increased by a sum of digits in a string containing only digits', () => {
      const res = sum('123')
      expect(res).to.be.eq(prevSum + 6)
      prevSum = res
    })
    it('should return a previously returned value for a string containing only letters', () => {
      const res = sum('abcdef')
      expect(res).to.be.eq(prevSum)
    })
    it('should return a previously returned value for a string that starts with letters', () => {
      const res = sum('abcdef1234')
      expect(res).to.be.eq(prevSum)
      prevSum = res
    })
    it('should return previously returned value increased by a sum of digits in a string that starts with digits', () => {
      const res = sum('1234abcdef')
      expect(res).to.be.eq(prevSum + 10)
      prevSum = res
    })
    it('should return a previously returned value if a string is empty', () => {
      const res = sum('')
      expect(res).to.be.eq(prevSum)
    })
  })
})()
