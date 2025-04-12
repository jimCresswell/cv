import Link from "next/link";
import React from "react";
import { describe, it, expect } from "vitest";

import { markdownLinksToNextLinks } from "./text-processing";

// Helper function for comparing arrays containing React elements
const compareReactNodeArrays = (actual: React.ReactNode[], expected: React.ReactNode[]) => {
  expect(actual.length).toEqual(expected.length);
  for (const [index, actualNode] of actual.entries()) {
    const expectedNode = expected[index];

    if (typeof actualNode === "string" && typeof expectedNode === "string") {
      expect(actualNode).toEqual(expectedNode);
    } else if (React.isValidElement(actualNode) && React.isValidElement(expectedNode)) {
      // Compare type and props for React elements
      expect(actualNode.type).toEqual(expectedNode.type);
      const actualProps = actualNode.props as Record<string, unknown>;
      const expectedProps = expectedNode.props as Record<string, unknown>;
      // Exclude 'key' from props comparison as it's special
      expect({ ...actualProps, key: undefined }).toEqual({ ...expectedProps, key: undefined });
    } else {
      // If types don't match or aren't string/element, fail the test
      expect(actualNode).toEqual(expectedNode); // This will likely fail and show the difference
    }
  }
};

describe("markdownLinksToNextLinks", () => {
  it("should return plain text wrapped in an array if no links are present", () => {
    const text = "This is plain text.";
    const expected = [text];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should handle a single link in the middle of the text", () => {
    const text = "Check out [Example](https://example.com) for more info.";
    const expected = [
      "Check out ",
      <Link
        key="https://example.com10"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Example
      </Link>,
      " for more info.",
    ];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should handle a single link using http (and leave it as plain text)", () => {
    const text = "Old site [Example](http://example.com) link.";
    const expected = [
      "Old site ",
      "[Example](http://example.com)", // Expect the raw markdown back
      " link.",
    ];
    // Note: We are not testing the console.warn directly here, just the output.
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should handle a single link at the beginning", () => {
    const text = "[Example](https://example.com) link at start.";
    const expected = [
      <Link
        key="https://example.com0"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Example
      </Link>,
      " link at start.",
    ];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should handle a single link at the end", () => {
    const text = "Link at end [Example](https://example.com)";
    const expected = [
      "Link at end ",
      <Link
        key="https://example.com13"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Example
      </Link>,
    ];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should handle multiple links", () => {
    const text = "Link [One](https://one.com) and link [Two](https://two.com).";
    const expected = [
      "Link ",
      <Link key="https://one.com5" href="https://one.com" target="_blank" rel="noopener noreferrer">
        One
      </Link>,
      " and link ",
      <Link
        key="https://two.com25"
        href="https://two.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Two
      </Link>,
      ".",
    ];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should handle links adjacent to each other", () => {
    const text = "[One](https://one.com)[Two](https://two.com)";
    const expected = [
      <Link key="https://one.com0" href="https://one.com" target="_blank" rel="noopener noreferrer">
        One
      </Link>,
      <Link
        key="https://two.com21"
        href="https://two.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Two
      </Link>,
    ];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should handle complex link text", () => {
    const text = "Link with [**bold** and _italic_](https://example.com).";
    const expected = [
      "Link with ",
      <Link
        key="https://example.com10"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        **bold** and _italic_
      </Link>,
      ".",
    ];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should ignore text that looks like a link but is not (e.g., missing URL)", () => {
    const text = "This [looks like] a link but is not.";
    const expected = [text];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should ignore text with brackets/parentheses in other contexts", () => {
    const text = "This text (contains parentheses) and [brackets].";
    const expected = [text];
    compareReactNodeArrays(markdownLinksToNextLinks(text), expected);
  });

  it("should throw TypeError for empty string input", () => {
    expect(() => markdownLinksToNextLinks("")).toThrow(TypeError);
    expect(() => markdownLinksToNextLinks("")).toThrow("Invalid text supplied: ");
  });

  it("should throw TypeError for non-string input", () => {
    /* eslint-disable unicorn/no-null */
    // @ts-expect-error Testing invalid input type
    expect(() => markdownLinksToNextLinks(null)).toThrow(TypeError);
    /* eslint-enable unicorn/no-null */
    // @ts-expect-error Testing invalid input type
    expect(() => markdownLinksToNextLinks()).toThrow(TypeError);
    // @ts-expect-error Testing invalid input type
    expect(() => markdownLinksToNextLinks(123)).toThrow(TypeError);
  });
});
