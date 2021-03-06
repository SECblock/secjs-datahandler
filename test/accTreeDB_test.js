const AccTreeDB = require('../src/accTreeDB.js')
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const testData = require('../db-structure/accTree.js').testData

const tokenJsonPath = path.join(__dirname, '../db-structure/tokenchain.json')

describe('Account Tree block chain database class test', () => {
  const config = {
    'DBPath': '../data/'
  }
  const accTree = new AccTreeDB(config)

  it('Clear DB test', (done) => {
    let address = '28f6af3bf89b7de2b5177f7747650d7321027055'
    let data = [1.2, 0]
    let root1 = accTree.getRoot()
    accTree.putAccInfo(address, data, (err) => {
      if (err) {
        expect.fail()
      } else {
        let root2 = accTree.getRoot()
        expect(root1).to.not.equal(root2)
        accTree.getAccInfo(address, (err, value) => {
          if (err) {
            expect.fail()
          } else {
            expect(value).to.deep.equal(data)
            accTree.clearDB((err) => {
              if (err) {
                expect.fail()
              } else {
                let root3 = accTree.getRoot()
                expect(root1).to.equal(root3)
                done()
              }
            })
          }
        })
      }
    })
  })

  it('Check if the merkle tree has the same root if data is written in different orders', (done) => {
    let index = 0
    let length = Object.keys(testData).length
    // Object.keys(testData).reverse().forEach((address) => {
    Object.keys(testData).forEach((address) => {
      accTree.putAccInfo(address, testData[address], (err) => {
        if (err) {
          expect.fail()
        } else {
          if (index + 1 === length) {
            accTree.clearDB((err) => {
              if (err) {
                expect.fail()
              } else {
                done()
              }
            })
          }
          index++
        }
      })
    })
  })

  it('_updateWithTx functionality test', (done) => {
    let txs = JSON.parse(fs.readFileSync(tokenJsonPath, 'utf8'))[2].Transactions
    accTree._updateWithTx(txs[0]).then(() => {
      accTree.getAllDB((err, data) => {
        if (err) {
          console.log(err)
          expect.fail()
        } else {
          expect(data).to.deep.equal({
            '1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju': [
              '999.216',
              '2',
              {
                From: ['8e10bfb36a8b6b2c81a17d8818863eeabab315baca38adb1b4f029bfe56f9374'],
                To: ['8e10bfb36a8b6b2c81a17d8818863eeabab315baca38adb1b4f029bfe56f9374']
              }
            ]
          })
          done()
        }
      })
    }).catch((err) => {
      console.log(err)
      expect.fail()
    })
  })

  it('updateWithBlock functionality test', (done) => {
    accTree.clearDB((err) => {
      if (err) {
        console.log(err)
        expect.fail()
      } else {
        let block = JSON.parse(fs.readFileSync(tokenJsonPath, 'utf8'))[0]
        accTree.updateWithBlock(block).then(() => {
          block = JSON.parse(fs.readFileSync(tokenJsonPath, 'utf8'))[1]
          accTree.updateWithBlock(block).then(() => {
            block = JSON.parse(fs.readFileSync(tokenJsonPath, 'utf8'))[2]
            accTree.updateWithBlock(block).then(() => {
              accTree.getRoots((err, array) => {
                if (err) {
                  console.log(err)
                  expect.fail()
                } else {
                  expect(array).to.deep.equal(['56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                                               'dd3e60f676e413959851730f852236cdcc82058cf016beed18a392aa4daf3cc7',
                                               '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1'])
                  done()
                }
              })
            }).catch((err) => {
              console.log(err)
              expect.fail()
            })
          }).catch((err) => {
            console.log(err)
            expect.fail()
          })
        }).catch((err) => {
          console.log(err)
          expect.fail()
        })
      }
    })
  })

  it('updateWithBlockChain functionality test', (done) => {
    accTree.clearDB((err) => {
      if (err) {
        console.log(err)
        expect.fail()
      } else {
        let blockchain = JSON.parse(fs.readFileSync(tokenJsonPath, 'utf8'))
        accTree.updateWithBlockChain(blockchain).then(() => {
          accTree.getRoots((err, array) => {
            if (err) {
              console.log(err)
              expect.fail()
            } else {
              expect(array).to.deep.equal([ '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
                                            'dd3e60f676e413959851730f852236cdcc82058cf016beed18a392aa4daf3cc7',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1',
                                            '2dfef189b0f19e6104a80f8f0f07a7e247bbba95b15b151a2ae2dc874cfdbec1' ])
              done()
            }
          })
        }).catch((err) => {
          console.log(err)
          expect.fail()
        })
      }
    })
  })

  it('revertBlock functionality test', (done) => {
    let block = JSON.parse(fs.readFileSync(tokenJsonPath, 'utf8'))[2]
    accTree.revertBlock(block).then(() => {
      accTree.getAllDB((err, data) => {
        if (err) {
          console.log(err)
          expect.fail()
        } else {
          expect(data).to.deep.equal({
            '1CmqKHsdhqJhkoWm9w5ALJXTPemxL339ju': [
              '999.626',
              '2',
              {
                From: ['401407fa4423c317f9c4d288e08c69c6853fea934ce53a094281358c1ef6526d'],
                To: ['401407fa4423c317f9c4d288e08c69c6853fea934ce53a094281358c1ef6526d']
              }
            ]
          })
          accTree.clearDB((err) => {
            if (err) {
              expect.fail()
            } else {
              done()
            }
          })
        }
      })
    }).catch((err) => {
      console.log(err)
      expect.fail()
    })
  })

  it('_updateRoots functionality test', (done) => {
    accTree._updateRoots(0, 'test').then(() => {
      accTree.getRoots((err, rootArray) => {
        if (err) {
          console.log(err)
          expect.fail()
        } else {
          expect(rootArray).to.deep.equal(['test'])
          accTree._clearRoots((err) => {
            if (err) {
              console.log(err)
              expect.fail()
            } else {
              accTree.getRoots((err, array) => {
                if (err) {
                  console.log(err)
                  expect.fail()
                } else {
                  expect(array).to.deep.equal([])
                  done()
                }
              })
            }
          })
        }
      })
    }).catch((err) => {
      console.log(err)
      expect.fail()
    })
  })
})
