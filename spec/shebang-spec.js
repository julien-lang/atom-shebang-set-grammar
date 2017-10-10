'use babel';

describe('Test Shebang', () => {
	let MyPackage

	beforeEach(() => {
		waitsForPromise(() => atom.packages.activatePackage('shebang-set-grammar').then((clk) => {
			MyPackage = clk.mainModule
		}))
	})

	it('shebang is required and must be at position 0', () => {
		expect(MyPackage.read_shebang("")).toBe(null)
		expect(MyPackage.read_shebang("python")).toBe(null)
		expect(MyPackage.read_shebang(" python")).toBe(null)
		expect(MyPackage.read_shebang(" #! python")).toBe(null)
	})

	it('basic shebang', () => {
		expect(MyPackage.read_shebang("#! python")).toBe("python")
		expect(MyPackage.read_shebang("#! bash")).toBe("bash")
		expect(MyPackage.read_shebang("#! sh")).toBe("sh")
		expect(MyPackage.read_shebang("#! perl")).toBe("perl")
		expect(MyPackage.read_shebang("#! abcd1234")).toBe("abcd1234")
	})

	it('absolute path', () => {
		expect(MyPackage.read_shebang("#! /usr/bin/python")).toBe("python")
		expect(MyPackage.read_shebang("#! /bin/bash")).toBe("bash")
	})

	it('extra arguments', () => {
		expect(MyPackage.read_shebang("#! /usr/bin/python -e")).toBe("python")
		expect(MyPackage.read_shebang("#! perl -e")).toBe("perl")
	})

	it('wrapper program', () => {
		expect(MyPackage.read_shebang("#! /usr/bin/env python")).toBe("python")
		expect(MyPackage.read_shebang("#! /usr/bin/env python -a -b")).toBe("python")
	})
})
