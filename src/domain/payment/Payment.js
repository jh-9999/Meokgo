export class Payment {
    //Private 캡슐화 인스턴스를 생성 할 때는 인스턴스 내부에 생성이 되지만, 외부에서는 접근이 불가능하다.
    #name;

    constructor(name) { this.#name = name; }

    get name() {return this.#name;}
}