// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericObject = { [key: string]: any };

interface Layer {
    effect: (name: string) => PropertyGroup;
}