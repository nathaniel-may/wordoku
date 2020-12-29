// singly linked list using type tags to emulate abstract data types.
export type Nil = { tag: "nil" };
export type Cons<A> = { tag: "cons", h: A, t: List<A> };
export type List<A> = Nil | Cons<A>;

// nil value
export const nil : Nil = { tag : "nil" }

// cons function
export function cons<A>(h: A, t: List<A>) : List<A> {
    return { tag: "cons", h, t };
}

// converts an array of all one type to a list
export function fromArray<A>(xs: A[]) : List<A> {
    const [head, ...tail] = xs;
    if (head === undefined) {
        return nil;
    } else {
        return cons(head, fromArray(tail));
    }
}

// converts a list to an array
export function fromList<A>(xs: List<A>) : A[] {
    switch (xs.tag) {
        case "nil"  : return [];
        case "cons" : return [xs.h].concat(fromList(xs.t));
    }
}

// zips two lists together. the length of the list will be the length
// of the shorter of the two lists.
//
// ex. (using array syntax for Lists)
// > zip([1,2,3], ['a', 'b', 'c'])
// > [[1, 'a'],[2, 'b'], [3, 'c']]
export function zip<A, B>(as: List<A>, bs: List<B>) : List<readonly [A, B]> {
    return zipWith((a, b) => [a, b] as const, as, bs);
}

// zips two lists together with a function to form a new list
//
// ex. (using array syntax for Lists)
// > zipWith((a, b) => (a*2) + "-" + b, [1,2,3], ['a', 'b', 'c'])
// > ["2-a", "4-b", "6-c"]
export function zipWith<A, B, C>(f: (a: A, b: B) => C, as: List<A>, bs: List<B>) : List<C> {
    switch (as.tag) {
        case "nil"  : return nil;
        case "cons" : switch (bs.tag) {
            case "nil"  : return nil;
            case "cons" : return cons(f(as.h, bs.h), zipWith(f, as.t, bs.t));
        }
    }
}

export function foldl<A, B>(f: (b: B, a: A) => B, z: B, xs: List<A>) : B {
    switch (xs.tag) {
        case "nil"  : return z;
        case "cons" : return f(foldl(f, z, xs.t), xs.h);
    }
}

export function map<A, B>(f: (a: A) => B, xs: List<A>) : List<B> {
    switch (xs.tag) {
        case "nil"  : return nil;
        case "cons" : return cons(f(xs.h), map(f, xs.t));
    }
}

export function foldr<A, B>(f: (a : A, b : B) => B, z: B, xs: List<A>) : B {
    switch (xs.tag) {
        case "nil"  : return z;
        case "cons" : return foldr(f, f(xs.h, z), xs.t);
    }
}